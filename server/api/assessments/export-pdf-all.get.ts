import { PrismaClient } from '@prisma/client'
import puppeteer from 'puppeteer'
import JSZip from 'jszip'
import { buildPuppeteerLaunchOptions } from '../../utils/resolveChromium'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

function getLogoBase64(): string {
  const logoPath = path.join(process.cwd(), 'assets', 'images', 'madziwa-logo.png')
  const logoBuffer = fs.readFileSync(logoPath)
  return `data:image/png;base64,${logoBuffer.toString('base64')}`
}

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    if (role !== 'admin' && role !== 'superadmin') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    const adminDistrictIdCookie = getCookie(event, 'adminDistrictId')
    const adminDistrictId = adminDistrictIdCookie ? parseInt(String(adminDistrictIdCookie)) : null

    const where: any = {}
    if (role === 'admin' && adminDistrictId) {
      where.student = { districtId: adminDistrictId }
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: { student: { include: { district: true } }, supervisor: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!assessments.length) {
      throw createError({ statusCode: 404, statusMessage: 'No assessments found' })
    }

    const browser = await puppeteer.launch(buildPuppeteerLaunchOptions())

    const zip = new JSZip()
    try {
      // Group assessments by student SRN (candidateNo)
      const assessmentsBySRN = assessments.reduce((groups, assessment) => {
        const srn = assessment.student.candidateNo
        if (!groups[srn]) {
          groups[srn] = {
            student: assessment.student,
            assessments: []
          }
        }
        groups[srn].assessments.push(assessment)
        return groups
      }, {} as Record<string, { student: any, assessments: any[] }>)

      // Create folders for each SRN and generate PDFs
      const totalAssessments = Object.values(assessmentsBySRN).reduce((sum, group) => sum + group.assessments.length, 0)
      let processedCount = 0
      
      for (const [srn, { student, assessments: studentAssessments }] of Object.entries(assessmentsBySRN)) {
        // Create a folder using the full candidate number
        const candidateNumber = student.candidateNo || srn
        const srnFolder = zip.folder(`Candidate_${candidateNumber}`)
        
        for (const assessment of studentAssessments) {
          try {
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
            // For other assessment types, use original calculation
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

          // Generate HTML content for PDF using the same function as individual PDFs
          const logoBase64 = getLogoBase64()
          const htmlContent = generateAssessmentHTML(assessment, totalMark, logoBase64)
          
          const page = await browser.newPage()
          await page.emulateMediaType('screen')
          await page.setContent(htmlContent, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 // 30 seconds timeout for page content
          })
          
          const pdf = await page.pdf({
            format: 'A4',
            margin: {
              top: '20mm',
              right: '20mm',
              bottom: '20mm',
              left: '20mm'
            },
            printBackground: true,
            preferCSSPageSize: true,
            timeout: 30000 // 30 seconds timeout for PDF generation
          })
          await page.close()
          
          // Create filename with assessment type and subject
          const assessmentType = assessment.formType || 'ECD'
          const fileName = `${assessmentType}_${assessment.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${assessment.topic.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
          srnFolder.file(fileName, pdf)
          
          // Update progress
          processedCount++
          console.log(`PDF generation progress: ${processedCount}/${totalAssessments} (${Math.round((processedCount/totalAssessments)*100)}%)`)
          
          // Small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100))
          
          } catch (assessmentError) {
            console.error(`Failed to generate PDF for assessment ${assessment.id}:`, assessmentError)
            // Continue with next assessment instead of failing completely
            processedCount++
          }
        }
      }
    } finally {
      try { await browser.close() } catch {}
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    setHeader(event, 'Content-Type', 'application/zip')
    setHeader(event, 'Content-Disposition', `attachment; filename="assessments-${new Date().toISOString().split('T')[0]}.zip"`)
    return zipBuffer
  } catch (error) {
    console.error('Export PDF all failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to export PDFs' })
  }
})

function generateAssessmentHTML(assessment: any, totalMark: number, logoBase64: string) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGrade = (score: number) => {
    if (score >= 80) return '1 (Excellent)'
    if (score >= 70) return '2.1 (Very Good)'
    if (score >= 60) return '2.2 (Good)'
    if (score >= 50) return '3 (Satisfactory)'
    return 'F (Fail)'
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
        .header-logo {
          width: 80px;
          height: auto;
          margin: 0 auto 15px;
          display: block;
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
        <img src="${logoBase64}" alt="Madziwa Teachers College Logo" class="header-logo" />
        <h1>Madziwa Teachers College</h1>
        <p>WIL Assessment Report</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
        ${assessment.formType ? `<p><strong>${
          assessment.formType === 'secondary' ? 'Secondary level teaching assessment' :
          assessment.formType === 'isen' ? 'Inclusion and Special Educational Needs' :
          assessment.formType === 'materials' ? 'Educational materials and resources assessment' :
          'ECD & Junior Levels'
        }</strong></p>` : ''}
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
            ${assessment.formType === 'materials' ? `
            <tr>
              <td><strong>Content Quality (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Relevance to curriculum (10 marks)<br/>
                    • Organization and structure (10 marks)
                  </em>
              </td>
              <td>${Math.min(assessment.preparationMark, 20)}</td>
              <td>20</td>
              <td>${Math.round((Math.min(assessment.preparationMark, 20) / 20) * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Pedagogical Value (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Alignment with learning objectives (5 marks)<br/>
                    • Student engagement strategies (5 marks)<br/>
                    • Connection to real-world applications (5 marks)<br/>
                    • Inclusive learning approaches (5 marks)
                  </em>
              </td>
              <td>${Math.min(assessment.lessonPlanningMark, 20)}</td>
              <td>20</td>
              <td>${Math.round((Math.min(assessment.lessonPlanningMark, 20) / 20) * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Design & Layout (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Visual appeal and clarity (5 marks)<br/>
                    • Navigation and usability (5 marks)<br/>
                    • Quality of presentation (5 marks)<br/>
                    • Consistency in design (5 marks)
                  </em>
              </td>
              <td>${Math.min(assessment.environmentMark, 20)}</td>
              <td>20</td>
              <td>${Math.round((Math.min(assessment.environmentMark, 20) / 20) * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Innovation & Creativity (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Originality and creativity (10 marks)<br/>
                    • Use of technology (10 marks)
                  </em>
              </td>
              <td>${Math.min(assessment.documentsMark, 20)}</td>
              <td>20</td>
              <td>${Math.round((Math.min(assessment.documentsMark, 20) / 20) * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Education 5.0 Compliance (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Local content integration (5 marks)<br/>
                    • Cultural heritage preservation (5 marks)<br/>
                    • Problem-solving focus (5 marks)<br/>
                    • Commercial viability (5 marks)
                  </em>
              </td>
              <td>${Math.min(assessment.introductionMark, 20)}</td>
              <td>20</td>
              <td>${Math.round((Math.min(assessment.introductionMark, 20) / 20) * 100)}%</td>
            </tr>
            ` : assessment.formType === 'ecd' ? `
            <tr>
              <td><strong>Preparation</strong></td>
              <td>${Math.min(assessment.preparationMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.preparationMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Lesson Facilitation</strong></td>
              <td>${Math.min(assessment.lessonPlanningMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.lessonPlanningMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Deportment</strong></td>
              <td>${Math.min(assessment.personalDimensionsMark, 5)}</td>
              <td>5</td>
              <td>${Math.round(Math.min(assessment.personalDimensionsMark, 5) / 5 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Records Management</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Register • Progress Record • Individual Social Record • Remedial • Extension work • Reading • Inventory Record • Test Record • WIL File • Anecdotal • Developmental Checklist • Health Record
                  </em>
              </td>
              <td>${Math.min(assessment.documentsMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.documentsMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Teaching and learning environment</strong><br/>
                  <ul style="margin: 0; padding-left: 20px; font-size: 0.9em; color: #666;">
                    <li>Classroom layout and conduciveness</li>
                    <li>Management of learning centres</li>
                  </ul>
              </td>
              <td>${Math.min(assessment.environmentMark, 10)}</td>
              <td>10</td>
              <td>${Math.round(Math.min(assessment.environmentMark, 10) / 10 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-based Child Study & Community Service</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    ${assessment.selectedResearchCategory === 'community_service' ? '✓ Selected' : 'Not Selected'}
                  </em>
              </td>
              <td>${assessment.selectedResearchCategory === 'community_service' ? Math.min(assessment.communityMark, 30) : 0}</td>
              <td>30</td>
              <td>${assessment.selectedResearchCategory === 'community_service' ? Math.round(Math.min(assessment.communityMark, 30) / 30 * 100) : 0}%</td>
            </tr>
            <tr>
              <td><strong>Research & Innovation</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    ${assessment.selectedResearchCategory === 'innovation' ? '✓ Selected' : 'Not Selected'}
                  </em>
              </td>
              <td>${assessment.selectedResearchCategory === 'innovation' ? Math.min(assessment.communityMark, 30) : 0}</td>
              <td>30</td>
              <td>${assessment.selectedResearchCategory === 'innovation' ? Math.round(Math.min(assessment.communityMark, 30) / 30 * 100) : 0}%</td>
            </tr>
            <tr>
              <td><strong>Research & Industrialisation</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    ${assessment.selectedResearchCategory === 'industrialisation' ? '✓ Selected' : 'Not Selected'}
                  </em>
              </td>
              <td>${assessment.selectedResearchCategory === 'industrialisation' ? Math.min(assessment.communityMark, 30) : 0}</td>
              <td>30</td>
              <td>${assessment.selectedResearchCategory === 'industrialisation' ? Math.round(Math.min(assessment.communityMark, 30) / 30 * 100) : 0}%</td>
            </tr>
            <tr>
              <td><strong>Remaining 2 pillars</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    ${assessment.selectedResearchCategory === 'community_service' ? 'Research & Innovation, Research & Industrialisation' : 
                     assessment.selectedResearchCategory === 'innovation' ? 'Research-based Child Study & Community Service, Research & Industrialisation' : 
                     assessment.selectedResearchCategory === 'industrialisation' ? 'Research-based Child Study & Community Service, Research & Innovation' : 'All three categories'}
                  </em>
              </td>
              <td>${Math.min(assessment.conclusionMark, 10)}</td>
              <td>10</td>
              <td>${Math.round(Math.min(assessment.conclusionMark, 10) / 10 * 100)}%</td>
            </tr>
            ` : assessment.formType === 'junior' ? `
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Preparation</td>
              <td>${Math.min(assessment.preparationMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.preparationMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Lesson Facilitation</td>
              <td>${Math.min(assessment.lessonPlanningMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.lessonPlanningMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Deportment</td>
              <td>${Math.min(assessment.personalDimensionsMark, 5)}</td>
              <td>5</td>
              <td>${Math.round(Math.min(assessment.personalDimensionsMark, 5) / 5 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Records Management</td>
              <td>${Math.min(assessment.documentsMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.documentsMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Teaching and Learning Environment</td>
              <td>${Math.min(assessment.environmentMark, 10)}</td>
              <td>10</td>
              <td>${Math.round(Math.min(assessment.environmentMark, 10) / 10 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>${assessment.selectedResearchCategory === 'community_service' ? 'Research-based Community Service' : 
                              assessment.selectedResearchCategory === 'innovation' ? 'Research & Innovation' : 
                              assessment.selectedResearchCategory === 'industrialisation' ? 'Research & Industrialisation' : 'Research Category'} (Selected Category)</strong>
              </td>
              <td>${Math.min(assessment.communityMark, 30)}</td>
              <td>30</td>
              <td>${Math.round(Math.min(assessment.communityMark, 30) / 30 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Remaining 2 Pillars</strong><br/>
                  <em>${assessment.selectedResearchCategory === 'community_service' ? 'Research & Innovation, Research & Industrialisation' : 
                       assessment.selectedResearchCategory === 'innovation' ? 'Research-based Community Service, Research & Industrialisation' : 
                       assessment.selectedResearchCategory === 'industrialisation' ? 'Research-based Community Service, Research & Innovation' : 'Not Selected'}</em>
              </td>
              <td>${Math.min(assessment.conclusionMark, 10)}</td>
              <td>10</td>
              <td>${Math.round(Math.min(assessment.conclusionMark, 10) / 10 * 100)}%</td>
            </tr>
            ` : (assessment.formType === 'ecd' || !assessment.formType) ? `
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Preparation</td>
              <td>${Math.min(assessment.preparationMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.preparationMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Lesson Facilitation</td>
              <td>${Math.min(assessment.lessonPlanningMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.lessonPlanningMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Deportment</td>
              <td>${Math.min(assessment.introductionMark, 5)}</td>
              <td>5</td>
              <td>${Math.round(Math.min(assessment.introductionMark, 5) / 5 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-Teaching & Learning</strong><br/>Records Management</td>
              <td>${Math.min(assessment.documentsMark, 15)}</td>
              <td>15</td>
              <td>${Math.round(Math.min(assessment.documentsMark, 15) / 15 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Teaching and Learning Environment</strong></td>
              <td>${Math.min(assessment.environmentMark, 10)}</td>
              <td>10</td>
              <td>${Math.round(Math.min(assessment.environmentMark, 10) / 10 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Research-based Community Service/Research & Innovation/Research & Industrialisation</strong></td>
              <td>${Math.min(assessment.developmentMark, 30)}</td>
              <td>30</td>
              <td>${Math.round(Math.min(assessment.developmentMark, 30) / 30 * 100)}%</td>
            </tr>
            <tr>
              <td><strong>Remaining 2 Pillars</strong></td>
              <td>${Math.min(assessment.conclusionMark, 10)}</td>
              <td>10</td>
              <td>${Math.round(Math.min(assessment.conclusionMark, 10) / 10 * 100)}%</td>
            </tr>
            ` : `
            <tr>
              <td>Preparation & Scheming</td>
              <td>${assessment.preparationMark}</td>
              <td>20</td>
              <td>${Math.round(assessment.preparationMark / 20 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Planning</td>
              <td>${assessment.lessonPlanningMark}</td>
              <td>20</td>
              <td>${Math.round(assessment.lessonPlanningMark / 20 * 100)}%</td>
            </tr>
            <tr>
              <td>Learning Environment & Management</td>
              <td>${assessment.environmentMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.environmentMark / 10 * 100)}%</td>
            </tr>
            <tr>
              <td>Other Work-Related Learning Documents</td>
              <td>${assessment.documentsMark}</td>
              <td>10</td>
              <td>${Math.round(assessment.documentsMark / 10 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Presentation: Introduction</td>
              <td>${assessment.introductionMark}</td>
              <td>3</td>
              <td>${Math.round(assessment.introductionMark / 3 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Presentation: Development</td>
              <td>${assessment.developmentMark}</td>
              <td>30</td>
              <td>${Math.round(assessment.developmentMark / 30 * 100)}%</td>
            </tr>
            <tr>
              <td>Lesson Presentation: Conclusion</td>
              <td>${assessment.conclusionMark}</td>
              <td>3</td>
              <td>${Math.round(assessment.conclusionMark / 3 * 100)}%</td>
            </tr>
            <tr>
              <td>Personal Dimensions</td>
              <td>${assessment.personalDimensionsMark}</td>
              <td>4</td>
              <td>${Math.round(assessment.personalDimensionsMark / 4 * 100)}%</td>
            </tr>
            <tr>
              <td>Community Engagement (Education 5.0)</td>
              <td>${assessment.communityMark || 0}</td>
              <td>20</td>
              <td>${Math.round(((assessment.communityMark || 0) / 20) * 100)}%</td>
            </tr>
            `}
          </tbody>
        </table>
      </div>

      <div class="total-score">
        <h3>Total Score</h3>
        <div class="score">${totalMark}/100</div>
        <div class="grade">${getGrade(totalMark)}</div>
      </div>

      ${assessment.formType === 'materials' ? `
      <div class="comment-section">
        <h3>Comments Breakdown (Materials Development)</h3>
        <table class="score-table">
          <thead>
            <tr>
              <th>Category & Aspects</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Content Quality (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Relevance to curriculum (10 marks)<br/>
                    • Organization and structure (10 marks)
                  </em>
              </td>
              <td>${assessment.preparationComment || ''}</td>
            </tr>
            <tr>
              <td><strong>Pedagogical Value (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Alignment with learning objectives (5 marks)<br/>
                    • Student engagement strategies (5 marks)<br/>
                    • Connection to real-world applications (5 marks)<br/>
                    • Inclusive learning approaches (5 marks)
                  </em>
              </td>
              <td>${assessment.lessonPlanningComment || ''}</td>
            </tr>
            <tr>
              <td><strong>Design & Layout (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Visual appeal and clarity (5 marks)<br/>
                    • Navigation and usability (5 marks)<br/>
                    • Quality of presentation (5 marks)<br/>
                    • Consistency in design (5 marks)
                  </em>
              </td>
              <td>${assessment.environmentComment || ''}</td>
            </tr>
            <tr>
              <td><strong>Innovation & Creativity (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Originality and creativity (10 marks)<br/>
                    • Use of technology (10 marks)
                  </em>
              </td>
              <td>${assessment.documentsComment || ''}</td>
            </tr>
            <tr>
              <td><strong>Education 5.0 Compliance (20 marks)</strong><br/>
                  <em style="font-size: 0.8em; color: #666;">
                    • Local content integration (5 marks)<br/>
                    • Cultural heritage preservation (5 marks)<br/>
                    • Problem-solving focus (5 marks)<br/>
                    • Commercial viability (5 marks)
                  </em>
              </td>
              <td>${assessment.introductionComment || ''}</td>
            </tr>
          </tbody>
        </table>
        <h3>Overall Comment</h3>
        <p>${assessment.overallComment || ''}</p>
      </div>
      ` : assessment.formType === 'ecd' ? `
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
             <tr>
               <td><strong>Research-based Child Study & Community Service</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">
                     ${assessment.selectedResearchCategory === 'community_service' ? '✓ Selected' : 'Not Selected'}
                   </em>
               </td>
               <td>${assessment.selectedResearchCategory === 'community_service' ? (assessment.communityComment || '') : ''}</td>
             </tr>
             <tr>
               <td><strong>Research & Innovation</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">
                     ${assessment.selectedResearchCategory === 'innovation' ? '✓ Selected' : 'Not Selected'}
                   </em>
               </td>
               <td>${assessment.selectedResearchCategory === 'innovation' ? (assessment.communityComment || '') : ''}</td>
             </tr>
             <tr>
               <td><strong>Research & Industrialisation</strong><br/>
                   <em style="font-size: 0.8em; color: #666;">
                     ${assessment.selectedResearchCategory === 'industrialisation' ? '✓ Selected' : 'Not Selected'}
                   </em>
               </td>
               <td>${assessment.selectedResearchCategory === 'industrialisation' ? (assessment.communityComment || '') : ''}</td>
             </tr>
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
         <table class="score-table">
           <thead>
             <tr>
               <th>Category</th>
               <th>Comments</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>Preparation & Scheming</td>
               <td>${assessment.preparationComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Planning</td>
               <td>${assessment.lessonPlanningComment || ''}</td>
             </tr>
             <tr>
               <td>Learning Environment & Management</td>
               <td>${assessment.environmentComment || ''}</td>
             </tr>
             <tr>
               <td>Other Work-Related Learning Documents</td>
               <td>${assessment.documentsComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Presentation: Introduction</td>
               <td>${assessment.introductionComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Presentation: Development</td>
               <td>${assessment.developmentComment || ''}</td>
             </tr>
             <tr>
               <td>Lesson Presentation: Conclusion</td>
               <td>${assessment.conclusionComment || ''}</td>
             </tr>
             <tr>
               <td>Personal Dimensions</td>
               <td>${assessment.personalDimensionsComment || ''}</td>
             </tr>
             <tr>
               <td>Community Engagement (Education 5.0)</td>
               <td>${assessment.communityComment || ''}</td>
             </tr>
           </tbody>
         </table>
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

