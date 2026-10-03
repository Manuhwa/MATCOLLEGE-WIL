import { PrismaClient } from '@prisma/client'
import puppeteer from 'puppeteer'
import JSZip from 'jszip'
import { buildPuppeteerLaunchOptions } from '../../utils/resolveChromium'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const body = await readBody(event)
    const { assessmentIds } = body

    if (!assessmentIds || !Array.isArray(assessmentIds) || assessmentIds.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Assessment IDs are required'
      })
    }

    // Get assessments with related data (admins restricted to their district)
    const assessments = await prisma.assessment.findMany({
      where: {
        id: { in: assessmentIds.map(id => parseInt(id)) },
        ...(role === 'admin' && adminDistrictId ? { student: { districtId: adminDistrictId } } : {}),
      },
      include: {
        student: true,
        supervisor: true
      }
    })

    if (assessments.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No assessments found'
      })
    }

    // Create ZIP file
    const zip = new JSZip()
    const browser = await puppeteer.launch(buildPuppeteerLaunchOptions())

    try {
      // Generate PDF for each assessment
      for (const assessment of assessments) {
        // Calculate total mark with proper calculation for consistency
        let totalMark
        if (assessment.formType === 'ecd') {
          // ECD: preparation + lessonPlanning + personalDimensions + documents + environment + community + conclusion
          totalMark = (assessment.preparationMark || 0) + 
                     (assessment.lessonPlanningMark || 0) + 
                     (assessment.personalDimensionsMark || 0) + 
                     (assessment.documentsMark || 0) + 
                     (assessment.environmentMark || 0) + 
                     (assessment.communityMark || 0) + 
                     (assessment.conclusionMark || 0)
        } else if (assessment.formType === 'junior') {
          // Junior: preparation + lessonPlanning + personalDimensions + documents + environment + community + conclusion
          totalMark = (assessment.preparationMark || 0) + 
                     (assessment.lessonPlanningMark || 0) + 
                     (assessment.personalDimensionsMark || 0) + 
                     (assessment.documentsMark || 0) + 
                     (assessment.environmentMark || 0) + 
                     (assessment.communityMark || 0) + 
                     (assessment.conclusionMark || 0)
        } else {
          // For other assessment types, use standard calculation
          totalMark = (assessment.preparationMark || 0) + 
                     (assessment.lessonPlanningMark || 0) + 
                     (assessment.environmentMark || 0) + 
                     (assessment.documentsMark || 0) + 
                     (assessment.introductionMark || 0) + 
                     (assessment.developmentMark || 0) + 
                     (assessment.conclusionMark || 0) + 
                     (assessment.personalDimensionsMark || 0) + 
                     (assessment.communityMark || 0)
        }
        
        // Cap total mark at 100
        totalMark = Math.min(totalMark, 100)

        // Generate HTML content for PDF
        const htmlContent = generateAssessmentHTML(assessment, totalMark)

        // Generate PDF with retry to avoid Target closed
        const page = await browser.newPage()
        await page.emulateMediaType('screen')
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })

        let pdf: Buffer | Uint8Array
        try {
          pdf = await page.pdf({
            format: 'A4',
            margin: {
              top: '20mm',
              right: '20mm',
              bottom: '20mm',
              left: '20mm'
            },
            printBackground: true,
            preferCSSPageSize: true
          })
        } catch (err) {
          const retryPage = await browser.newPage()
          await retryPage.emulateMediaType('screen')
          await retryPage.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
          pdf = await retryPage.pdf({
            format: 'A4',
            margin: {
              top: '20mm',
              right: '20mm',
              bottom: '20mm',
              left: '20mm'
            },
            printBackground: true,
            preferCSSPageSize: true
          })
          await retryPage.close()
        }

        await page.close()

        // Add PDF to ZIP grouped by candidate number
        const candidateFolder = assessment.student.candidateNo.replace(/[^a-zA-Z0-9]/g, '_')
        const critName = assessment.subject.replace(/[^a-zA-Z0-9]/g, '_')
        const fileName = `${candidateFolder}/${critName}.pdf`
        zip.file(fileName, pdf)
      }
    } finally {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Set response headers
    setHeader(event, 'Content-Type', 'application/zip')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessments-${new Date().toISOString().split('T')[0]}.zip"`)

    return zipBuffer
  } catch (error) {
    console.error('Error generating ZIP:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate ZIP file'
    })
  }
})

function generateAssessmentHTML(assessment: any, totalMark: number) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGrade = (score: number) => {
    if (score >= 80) return '1'
    if (score >= 70) return '2.1'
    if (score >= 60) return '2.2'
    if (score >= 50) return '3'
    return 'F'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Assessment Report - ${assessment.student.fullName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #096540;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #096540;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h2 {
          color: #096540;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-item {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #096540;
        }
        .info-item label {
          font-weight: bold;
          color: #374151;
          display: block;
          margin-bottom: 5px;
        }
        .info-item p {
          margin: 0;
          color: #111827;
        }
        .score-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .score-table th,
        .score-table td {
          border: 1px solid #d1d5db;
          padding: 12px;
          text-align: left;
        }
        .score-table th {
          background: #f3f4f6;
          font-weight: bold;
          color: #374151;
        }
        .score-table tr:nth-child(even) {
          background: #f9fafb;
        }
        .total-score {
          background: linear-gradient(135deg, #096540, #0b7a55);
          color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 30px 0;
        }
        .total-score h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .total-score .score {
          font-size: 36px;
          font-weight: bold;
          margin: 10px 0;
        }
        .total-score .grade {
          font-size: 18px;
          opacity: 0.9;
        }
        .comment-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .comment-section h3 {
          color: #096540;
          margin-top: 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Madziwa Teachers College</h1>
        <p>WIL Assessment Report</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Student Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Full Name:</label>
            <p>${assessment.student.fullName}</p>
          </div>
          <div class="info-item">
            <label>Candidate Number:</label>
            <p>${assessment.student.candidateNo}</p>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <p>${assessment.student.email}</p>
          </div>
          <div class="info-item">
            <label>School:</label>
            <p>${assessment.student.schoolName}</p>
          </div>
          <div class="info-item">
            <label>Class:</label>
            <p>${assessment.student.className}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Supervisor Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Full Name:</label>
            <p>${assessment.supervisor.fullName}</p>
          </div>
          <div class="info-item">
            <label>Email:</label>
            <p>${assessment.supervisor.email}</p>
          </div>
          <div class="info-item">
            <label>Phone Number:</label>
            <p>${assessment.supervisor.phoneNumber}</p>
          </div>
          <div class="info-item">
            <label>National ID:</label>
            <p>${assessment.supervisor.nationalId}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Assessment Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Subject:</label>
            <p>${assessment.subject}</p>
          </div>
          <div class="info-item">
            <label>Topic:</label>
            <p>${assessment.topic}</p>
          </div>
          <div class="info-item">
            <label>Assessment Date:</label>
            <p>${formatDate(assessment.assessmentDate)}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Scoring Breakdown</h2>
        <table class="score-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Score</th>
              <th>Maximum</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Preparation</td>
              <td>${assessment.preparationMark}</td>
              <td>15</td>
              <td>${Math.round(assessment.preparationMark / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Lesson Facilitation</td>
              <td>${assessment.lessonPlanningMark}</td>
              <td>15</td>
              <td>${Math.round(assessment.lessonPlanningMark / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Deportment</td>
              <td>${assessment.personalDimensionsMark}</td>
              <td>5</td>
              <td>${Math.round(assessment.personalDimensionsMark / 5 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Records Management</td>
              <td>${assessment.documentsMark}</td>
              <td>15</td>
              <td>${Math.round(assessment.documentsMark / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Teaching and Learning Environment</strong></td>
              <td>${assessment.environmentMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.environmentMark / 10 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-based Community Service/Research & Innovation/Research & Industrialisation</strong></td>
              <td>${assessment.communityMark}</td>
              <td>30</td>
              <td>${Math.round(assessment.communityMark / 30 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Remaining 2 Pillars</strong></td>
              <td>${assessment.conclusionMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.conclusionMark / 10 * 100)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="total-score">
        <h3>Total Score</h3>
        <div class="score">${totalMark}/100</div>
        <div class="grade">${getGrade(totalMark)}</div>
      </div>

      ${assessment.formType === 'ecd' ? `
       <div class="comment-section">
         <h3>Comments Breakdown</h3>
         <table class="score-table">
           <thead>
             <tr>
               <th>Category</th>
               <th>Comments</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td><strong>Preparation</strong></td>
               <td>${assessment.preparationComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Lesson Facilitation</strong></td>
               <td>${assessment.lessonPlanningComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Deportment</strong></td>
               <td>${assessment.personalDimensionsComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Records Management</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">
                     • Register • Progress Record • Individual Social Record • Remedial • Extension work • Reading • Inventory Record • Test Record • WIL File • Anecdotal • Developmental Checklist • Health Record
                   </em>
               </td>
               <td>${assessment.documentsComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Teaching and learning environment</strong><br/>
                   <ul style="margin: 0; padding-left: 20px; font-size: 0.9em; color: #666;">
                     <li>Classroom layout and conduciveness</li>
                     <li>Management of learning centres</li>
                   </ul>
               </td>
               <td>${assessment.environmentComment || ''}</td>
             </tr>
             ${assessment.selectedResearchCategory === 'community_service' ? `
             <tr>
               <td><strong>Research-based Child Study & Community Service</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">✓ Selected</em>
               </td>
               <td>${assessment.communityComment || ''}</td>
             </tr>
             ` : ''}
             ${assessment.selectedResearchCategory === 'innovation' ? `
             <tr>
               <td><strong>Research & Innovation</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">✓ Selected</em>
               </td>
               <td>${assessment.communityComment || ''}</td>
             </tr>
             ` : ''}
             ${assessment.selectedResearchCategory === 'industrialisation' ? `
             <tr>
               <td><strong>Research & Industrialisation</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">✓ Selected</em>
               </td>
               <td>${assessment.communityComment || ''}</td>
             </tr>
             ` : ''}
             <tr>
               <td><strong>Remaining 2 pillars</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">
                     ${assessment.selectedResearchCategory === 'community_service' ? 'Research & Innovation, Research & Industrialisation' : 
                      assessment.selectedResearchCategory === 'innovation' ? 'Research-based Child Study & Community Service, Research & Industrialisation' : 
                      assessment.selectedResearchCategory === 'industrialisation' ? 'Research-based Child Study & Community Service, Research & Innovation' : 'All three categories'}
                   </em>
               </td>
               <td>${assessment.conclusionComment || ''}</td>
             </tr>
           </tbody>
         </table>
         <h3>Overall Comment</h3>
         <p>${assessment.overallComment || ''}</p>
       </div>
      ` : (assessment.formType === 'junior' || !assessment.formType) ? `
       <div class="comment-section">
         <h3>Comments Breakdown</h3>
         <table class="score-table">
           <thead>
             <tr>
               <th>Category</th>
               <th>Comments</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Preparation</td>
               <td>${assessment.preparationComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Lesson Facilitation</td>
               <td>${assessment.lessonPlanningComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Deportment</td>
               <td>${assessment.personalDimensionsComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Records Management</td>
               <td>${assessment.documentsComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Research-Teaching & Learning</strong><br/>Teaching and Learning Environment</td>
               <td>${assessment.environmentComment || ''}</td>
             </tr>
             <tr>
               <td><strong>${assessment.selectedResearchCategory === 'community_service' ? 'Research-based Community Service' : 
                               assessment.selectedResearchCategory === 'innovation' ? 'Research & Innovation' : 
                               assessment.selectedResearchCategory === 'industrialisation' ? 'Research & Industrialisation' : 'Research Category'} (Selected Category)</strong></td>
               <td>${assessment.communityComment || ''}</td>
             </tr>
             <tr>
               <td><strong>Remaining 2 Pillars</strong><br/>
                   <em>${assessment.selectedResearchCategory === 'community_service' ? 'Research & Innovation, Research & Industrialisation' : 
                        assessment.selectedResearchCategory === 'innovation' ? 'Research-based Community Service, Research & Industrialisation' : 
                        assessment.selectedResearchCategory === 'industrialisation' ? 'Research-based Community Service, Research & Innovation' : 'Not Selected'}</em>
               </td>
               <td>${assessment.conclusionComment || ''}</td>
             </tr>
           </tbody>
         </table>
         <h3>Overall Comment</h3>
         <p>${assessment.overallComment || ''}</p>
       </div>
      ` : `
       <div class="comment-section">
         <h3>Comments Breakdown</h3>
         <ul>
           <li><strong>Research-Teaching & Learning - Preparation:</strong> ${assessment.preparationComment || ''}</li>
           <li><strong>Research-Teaching & Learning - Lesson Facilitation:</strong> ${assessment.lessonPlanningComment || ''}</li>
           <li><strong>Research-Teaching & Learning - Deportment:</strong> ${assessment.introductionComment || ''}</li>
           <li><strong>Research-Teaching & Learning - Records Management:</strong> ${assessment.documentsComment || ''}</li>
           <li><strong>Teaching and Learning Environment:</strong> ${assessment.environmentComment || ''}</li>
           <li><strong>Research-based Community Service/Research & Innovation/Research & Industrialisation:</strong> ${assessment.developmentComment || ''}</li>
           <li><strong>Remaining 2 Pillars:</strong> ${assessment.conclusionComment || ''}</li>
         </ul>
         <h3>Overall Comment</h3>
         <p>${assessment.overallComment || ''}</p>
       </div>
      `}

      <div class="footer">
        <p>This report was generated by the Madziwa Teachers College WIL Assessment Platform</p>
        <p>Contact: +263 772 145 972 | Email: madziwatc@gmail.com</p>
      </div>
    </body>
    </html>
  `
} 