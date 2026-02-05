import { PrismaClient } from '@prisma/client'
import type { H3Event } from 'h3'
import { createError, getCookie, readMultipartFormData, defineEventHandler } from 'h3'
import * as XLSX from 'xlsx/xlsx.mjs'

const prisma = new PrismaClient()

type ImportRow = Record<string, any>

const MAX = {
  // ECD/Junior fields
  preparationMark: 15,
  lessonFacilitationMark: 15,
  deportmentMark: 5,
  recordsMark: 15,
  environmentMark: 10,
  communityMark: 30,
  remainingPillarsMark: 10,
  // Secondary/ISEN fields
  lessonPlanningMark: 20,
  documentsMark: 10,
  introductionMark: 3,
  developmentMark: 30,
  conclusionMark: 3,
  personalDimensionsMark: 4,
  // Materials Development fields
  contentRelevanceMark: 10,
  contentOrganizationMark: 10,
  contentTotalMark: 20,
  pedagogicalAlignmentMark: 5,
  pedagogicalEngagementMark: 5,
  pedagogicalConnectionMark: 5,
  pedagogicalInclusiveMark: 5,
  pedagogicalTotalMark: 20,
  designVisualMark: 5,
  designNavigationMark: 5,
  designQualityMark: 5,
  designConsistencyMark: 5,
  designTotalMark: 20,
  innovationOriginalityMark: 10,
  innovationTechnologyMark: 10,
  innovationTotalMark: 20,
  educationLocalMark: 5,
  educationHeritageMark: 5,
  educationProblemMark: 5,
  educationCommercialMark: 5,
  educationTotalMark: 20,
  materialsTotalMark: 100,
  materialsTotalPercentage: 100,
}

function clampNumber(value: any, max: number): number {
  const n = Number(value)
  if (Number.isNaN(n) || n < 0) return 0
  return Math.min(Math.round(n), max)
}

function parseDate(input: any): Date | null {
  if (!input) return null
  if (input instanceof Date) return input
  // Excel might give numbers (serials) or strings
  const asNumber = Number(input)
  if (!Number.isNaN(asNumber) && asNumber > 25569) {
    // Excel serial date to JS Date
    const utcDays = Math.floor(asNumber - 25569)
    return new Date(utcDays * 86400 * 1000)
  }
  const d = new Date(input)
  return isNaN(d.getTime()) ? null : d
}

function validateMark(value: any, fieldName: string, maxValue: number): { isValid: boolean; error?: string; correctedValue?: number } {
  const num = Number(value)

  // Check if value is a valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName}: "${value}" is not a valid number. Please enter a numeric value.`
    }
  }

  // Check if value is negative
  if (num < 0) {
    return {
      isValid: false,
      error: `${fieldName}: "${num}" is negative. Marks cannot be negative. Please enter a value between 0 and ${maxValue}.`
    }
  }

  // Check if value exceeds maximum
  if (num > maxValue) {
    return {
      isValid: false,
      error: `${fieldName}: "${num}" exceeds the maximum allowed value of ${maxValue}. Please enter a value between 0 and ${maxValue}.`,
      correctedValue: maxValue
    }
  }

  // Check if value is a whole number (no decimals)
  if (num % 1 !== 0) {
    return {
      isValid: false,
      error: `${fieldName}: "${num}" contains decimals. Please enter a whole number between 0 and ${maxValue}.`,
      correctedValue: Math.round(num)
    }
  }

  return { isValid: true }
}

function simplifyKey(key: string): string {
  return String(key || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function normalizeRow(row: ImportRow): ImportRow {
  const canonical: Record<string, string> = {
    // Basic student/supervisor fields
    fullname: 'fullName',
    sex: 'sex',
    candidateno: 'candidateNo',
    studentcandidate: 'candidateNo', // Map STUDENT CANDIDATE to candidateNo
    email: 'email',
    schoolname: 'schoolName',
    classname: 'className',
    supervisorfullname: 'supervisorFullName',
    supervisoremail: 'supervisorEmail',
    supervisorphonenumber: 'supervisorPhoneNumber',
    supervisornationalid: 'supervisorNationalId',

    // Assessment metadata
    assessmentdate: 'assessmentDate',
    subject: 'subject',
    topic: 'topic',
    formtype: 'formType',
    overallcomment: 'overallComment',

    // Research category
    selectedresearchcategory: 'selectedResearchCategory',
    researchcategory: 'selectedResearchCategory',
    selectedcategory: 'selectedCategory',

    // Preparation - all types
    preparationmark15: 'preparationMark',
    preparationmark: 'preparationMark',
    preparationcomment: 'preparationComment',

    // Lesson Facilitation/Planning - maps differently per type but normalized to these
    lessonfacilitationmark15: 'lessonFacilitationMark',
    lessonfacilitationmark: 'lessonFacilitationMark',
    lessonfacilitationcomment: 'lessonFacilitationComment',
    lessonplanningmark20: 'lessonPlanningMark',
    lessonplanningmark: 'lessonPlanningMark',
    lessonplanningcomment: 'lessonPlanningComment',

    // Deportment - maps to personalDimensionsMark in DB for some types
    deportmentmark5: 'deportmentMark',
    deportmentmark: 'deportmentMark',
    deportmentcomment: 'deportmentComment',
    personaldimensionsmark: 'personalDimensionsMark',
    personaldimensionsmark4: 'personalDimensionsMark',
    personaldimensionscomment: 'personalDimensionsComment',
    personalmark: 'personalDimensionsMark',
    personalcomment: 'personalDimensionsComment',

    // Records Management - maps to documentsMark OR recordsMark
    recordsmanagementmark15: 'recordsMark',
    recordsmanagementmark: 'recordsMark',
    recordsmanagementcomment: 'recordsComment',
    recordsmark15: 'recordsMark',
    recordsmark: 'recordsMark',
    recordscomment: 'recordsComment',
    documentsmark10: 'documentsMark',
    documentsmark: 'documentsMark',
    documentscomment: 'documentsComment',
    documentmark: 'documentsMark',
    documentcomment: 'documentsComment',

    // Environment
    environmentmark10: 'environmentMark',
    environmentmark: 'environmentMark',
    environmentcomment: 'environmentComment',

    // Community/Research marks
    communitymark30: 'communityMark',
    communitymark: 'communityMark',
    communitycomment: 'communityComment',

    // Remaining Pillars - maps to conclusionMark in DB
    remaining2pillarsmark10: 'remainingPillarsMark',
    remaining2pillarsmark: 'remainingPillarsMark',
    remaining2pillarscomment: 'remainingPillarsComment',
    remainingpillarsmark: 'remainingPillarsMark',
    remainingpillarscomment: 'remainingPillarsComment',
    remainingpillars: 'remainingPillars',

    // Introduction/Development/Conclusion (secondary/ISEN)
    introductionmark3: 'introductionMark',
    introductionmark: 'introductionMark',
    introductioncomment: 'introductionComment',
    developmentmark30: 'developmentMark',
    developmentmark: 'developmentMark',
    developmentcomment: 'developmentComment',
    conclusionmark3: 'conclusionMark',
    conclusionmark: 'conclusionMark',
    conclusioncomment: 'conclusionComment',

    // Materials Development fields
    contentqualitymark25: 'preparationMark',  // Reuses preparationMark
    contentqualitymark: 'preparationMark',
    contentqualitycomment: 'preparationComment',
    pedagogicalvaluemark25: 'lessonPlanningMark',  // Reuses lessonPlanningMark
    pedagogicalvaluemark: 'lessonPlanningMark',
    pedagogicalvaluecomment: 'lessonPlanningComment',
    designlayoutmark20: 'environmentMark',  // Reuses environmentMark
    designlayoutmark: 'environmentMark',
    designlayoutcomment: 'environmentComment',
    innovationcreativitymark15: 'documentsMark',  // Reuses documentsMark
    innovationcreativitymark: 'documentsMark',
    innovationcreativitycomment: 'documentsComment',
    education50mark15: 'communityMark',  // Reuses communityMark
    education50mark: 'communityMark',
    education50comment: 'communityComment',

    // Materials Development detailed fields (matching new template exactly)
    // Content section
    contentrelevancemark10: 'contentRelevanceMark',
    contentrelevancemark: 'contentRelevanceMark',
    contentrelevancecomment: 'contentRelevanceComment',
    contentorganizationmark10: 'contentOrganizationMark',
    contentorganizationmark: 'contentOrganizationMark',
    contentorganizationcomment: 'contentOrganizationComment',
    contenttotalmark: 'contentTotalMark',
    contentcomment: 'contentComment',
    // Pedagogical section
    pedagogicalalignmentmark5: 'pedagogicalAlignmentMark',
    pedagogicalalignmentmark: 'pedagogicalAlignmentMark',
    pedagogicalalignmentcomment: 'pedagogicalAlignmentComment',
    pedagogicalengagementmark5: 'pedagogicalEngagementMark',
    pedagogicalengagementmark: 'pedagogicalEngagementMark',
    pedagogicalengagementcomment: 'pedagogicalEngagementComment',
    pedagogicalconnectionmark5: 'pedagogicalConnectionMark',
    pedagogicalconnectionmark: 'pedagogicalConnectionMark',
    pedagogicalconnectioncomment: 'pedagogicalConnectionComment',
    pedagogicalinclusivemark5: 'pedagogicalInclusiveMark',
    pedagogicalinclusivemark: 'pedagogicalInclusiveMark',
    pedagogicalinclusivecomment: 'pedagogicalInclusiveComment',
    pedagogicaltotalmark: 'pedagogicalTotalMark',
    pedagogicalcomment: 'pedagogicalComment',
    // Design section
    designvisualmark5: 'designVisualMark',
    designvisualmark: 'designVisualMark',
    designvisualcomment: 'designVisualComment',
    designnavigationmark5: 'designNavigationMark',
    designnavigationmark: 'designNavigationMark',
    designnavigationcomment: 'designNavigationComment',
    designqualitymark5: 'designQualityMark',
    designqualitymark: 'designQualityMark',
    designqualitycomment: 'designQualityComment',
    designconsistencymark5: 'designConsistencyMark',
    designconsistencymark: 'designConsistencyMark',
    designconsistencycomment: 'designConsistencyComment',
    designtotalmark: 'designTotalMark',
    designcomment: 'designComment',
    // Innovation section
    innovationoriginalitymark10: 'innovationOriginalityMark',
    innovationoriginalitymark: 'innovationOriginalityMark',
    innovationoriginalitycomment: 'innovationOriginalityComment',
    innovationtechnologymark10: 'innovationTechnologyMark',
    innovationtechnologymark: 'innovationTechnologyMark',
    innovationtechnologycomment: 'innovationTechnologyComment',
    innovationtotalmark: 'innovationTotalMark',
    innovationcomment: 'innovationComment',
    // Education 5.0 section
    educationlocalmark5: 'educationLocalMark',
    educationlocalmark: 'educationLocalMark',
    educationlocalcomment: 'educationLocalComment',
    educationheritagemark5: 'educationHeritageMark',
    educationheritagemark: 'educationHeritageMark',
    educationheritagecomment: 'educationHeritageComment',
    educationproblemmark5: 'educationProblemMark',
    educationproblemmark: 'educationProblemMark',
    educationproblemcomment: 'educationProblemComment',
    educationcommercialmark5: 'educationCommercialMark',
    educationcommercialmark: 'educationCommercialMark',
    educationcommercialcomment: 'educationCommercialComment',
    educationtotalmark: 'educationTotalMark',
    educationcomment: 'educationComment',
    materialstotalmark: 'materialsTotalMark',
    materialstotalpercentage: 'materialsTotalPercentage',
    supervisordesignation: 'supervisorDesignation',
  }

  const normalized: ImportRow = {}
  for (const [k, v] of Object.entries(row)) {
    const simp = simplifyKey(k)
    const target = canonical[simp]
    if (target) normalized[target] = v
    else normalized[k] = v
  }
  return normalized
}

async function upsertSupervisor(row: ImportRow) {
  const email = String(row.supervisorEmail || '').trim()
  const nationalId = String(row.supervisorNationalId || '').trim()
  const data = {
    fullName: String(row.supervisorFullName || '').trim(),
    email,
    phoneNumber: String(row.supervisorPhoneNumber || '').trim(),
    nationalId,
  }

  // Prefer email as unique id, fallback to nationalId
  let sup = email
    ? await prisma.supervisor.findUnique({ where: { email } })
    : nationalId
      ? await prisma.supervisor.findUnique({ where: { nationalId } })
      : null

  if (!sup) {
    sup = await prisma.supervisor.create({ data })
  } else {
    // Keep record fresh with latest details
    sup = await prisma.supervisor.update({ where: { id: sup.id }, data })
  }
  return sup
}

async function upsertStudent(row: ImportRow) {
  const candidateNo = String(row.candidateNo || '').trim()

  // Find existing student by candidate number
  let stu = await prisma.student.findUnique({ where: { candidateNo } })

  if (!stu) {
    // If student doesn't exist, create with minimal data (only candidate number)
    // Other details will need to be added manually through the student management interface
    const data = {
      fullName: String(row.fullName || '').trim() || `Student ${candidateNo}`, // Default name if not provided
      sex: String(row.sex || '').trim() || 'M', // Default to Male if not provided
      candidateNo,
      email: String(row.email || '').trim() || `${candidateNo}@example.com`, // Default email if not provided
      schoolName: String(row.schoolName || '').trim() || 'Unknown School', // Default school if not provided
      className: String(row.className || '').trim() || 'Unknown Class', // Default class if not provided
    }
    stu = await prisma.student.create({ data })
  } else {
    // If student exists, keep existing data (don't update from Excel)
    // The student details in the database are considered the source of truth
    console.log(`Student ${candidateNo} already exists, using existing data from database`)
  }
  return stu
}

function validateAllMarks(row: ImportRow): { errors: string[], correctedData: any } {
  const errors: string[] = []
  const correctedData: any = {}

  // Define all mark fields and their maximum values
  const markFields = [
    { field: 'preparationMark', max: MAX.preparationMark, name: 'Preparation Mark' },
    { field: 'lessonPlanningMark', max: MAX.lessonPlanningMark, name: 'Lesson Planning Mark' },
    { field: 'lessonFacilitationMark', max: MAX.lessonFacilitationMark, name: 'Lesson Facilitation Mark' },
    { field: 'deportmentMark', max: MAX.deportmentMark, name: 'Deportment Mark' },
    { field: 'recordsMark', max: MAX.recordsMark, name: 'Records Mark' },
    { field: 'environmentMark', max: MAX.environmentMark, name: 'Environment Mark' },
    { field: 'documentsMark', max: MAX.documentsMark, name: 'Documents Mark' },
    { field: 'introductionMark', max: MAX.introductionMark, name: 'Introduction Mark' },
    { field: 'developmentMark', max: MAX.developmentMark, name: 'Development Mark' },
    { field: 'conclusionMark', max: MAX.conclusionMark, name: 'Conclusion Mark' },
    { field: 'personalDimensionsMark', max: MAX.personalDimensionsMark, name: 'Personal Dimensions Mark' },
    { field: 'communityMark', max: MAX.communityMark, name: 'Community Mark' },
    { field: 'remainingPillarsMark', max: MAX.remainingPillarsMark, name: 'Remaining Pillars Mark' },
  ]

  // Validate each mark field
  markFields.forEach(({ field, max, name }) => {
    if (row[field] !== undefined && row[field] !== null && row[field] !== '') {
      const validation = validateMark(row[field], name, max)
      if (!validation.isValid) {
        errors.push(validation.error!)
        if (validation.correctedValue !== undefined) {
          correctedData[field] = validation.correctedValue
        }
      } else {
        correctedData[field] = row[field]
      }
    }
  })

  return { errors, correctedData }
}

function mapAssessmentData(row: ImportRow) {
  const assessmentDate = parseDate(row.assessmentDate)
  if (!assessmentDate) throw new Error('Invalid assessmentDate')

  // Validate all marks first
  const { errors, correctedData } = validateAllMarks(row)
  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join('\n')}`)
  }

  const formType = String(row.formType || 'junior').toLowerCase()

  // Build base assessment data - fields that exist in the database schema
  const base: Record<string, any> = {
    assessmentDate,
    subject: String(row.subject || '').trim(),
    topic: String(row.topic || '').trim(),
    formType,
    overallComment: String(row.overallComment || '').trim(),
    selectedCategory: String(row.selectedCategory || '').trim(),
    remainingPillars: String(row.remainingPillars || '').trim(),
    selectedResearchCategory: String(row.selectedResearchCategory || '').trim(),
    // Initialize all marks to 0
    preparationMark: 0,
    preparationComment: '',
    lessonPlanningMark: 0,
    lessonPlanningComment: '',
    environmentMark: 0,
    environmentComment: '',
    documentsMark: 0,
    documentsComment: '',
    introductionMark: 0,
    introductionComment: '',
    developmentMark: 0,
    developmentComment: '',
    conclusionMark: 0,
    conclusionComment: '',
    personalDimensionsMark: 0,
    personalDimensionsComment: '',
    communityMark: 0,
    communityComment: '',
  }

  // Map fields based on form type
  if (formType === 'ecd' || formType === 'junior') {
    // ECD/Junior field mappings:
    // - preparationMark stays as is
    // - lessonFacilitationMark → lessonPlanningMark (database field)
    // - deportmentMark → personalDimensionsMark (database field)
    // - recordsMark → documentsMark (database field)
    // - environmentMark stays as is
    // - communityMark stays as is
    // - remainingPillarsMark → conclusionMark (database field)

    base.preparationMark = clampNumber(correctedData.preparationMark || row.preparationMark, MAX.preparationMark)
    base.preparationComment = String(row.preparationComment || '').trim()

    // lessonFacilitationMark maps to lessonPlanningMark in DB
    base.lessonPlanningMark = clampNumber(
      correctedData.lessonFacilitationMark || row.lessonFacilitationMark || correctedData.lessonPlanningMark || row.lessonPlanningMark,
      MAX.lessonFacilitationMark
    )
    base.lessonPlanningComment = String(row.lessonFacilitationComment || row.lessonPlanningComment || '').trim()

    // deportmentMark maps to personalDimensionsMark in DB
    base.personalDimensionsMark = clampNumber(
      correctedData.deportmentMark || row.deportmentMark || correctedData.personalDimensionsMark || row.personalDimensionsMark,
      MAX.deportmentMark
    )
    base.personalDimensionsComment = String(row.deportmentComment || row.personalDimensionsComment || '').trim()

    // recordsMark maps to documentsMark in DB
    base.documentsMark = clampNumber(
      correctedData.recordsMark || row.recordsMark || correctedData.documentsMark || row.documentsMark,
      MAX.recordsMark
    )
    base.documentsComment = String(row.recordsComment || row.documentsComment || '').trim()

    base.environmentMark = clampNumber(correctedData.environmentMark || row.environmentMark, MAX.environmentMark)
    base.environmentComment = String(row.environmentComment || '').trim()

    base.communityMark = clampNumber(correctedData.communityMark || row.communityMark, MAX.communityMark)
    base.communityComment = String(row.communityComment || '').trim()

    // remainingPillarsMark maps to conclusionMark in DB
    base.conclusionMark = clampNumber(
      correctedData.remainingPillarsMark || row.remainingPillarsMark || correctedData.conclusionMark || row.conclusionMark,
      MAX.remainingPillarsMark
    )
    base.conclusionComment = String(row.remainingPillarsComment || row.conclusionComment || '').trim()

  } else if (formType === 'secondary' || formType === 'isen') {
    // Secondary/ISEN use similar mappings as ECD/Junior
    base.preparationMark = clampNumber(correctedData.preparationMark || row.preparationMark, MAX.preparationMark)
    base.preparationComment = String(row.preparationComment || '').trim()

    base.lessonPlanningMark = clampNumber(
      correctedData.lessonFacilitationMark || row.lessonFacilitationMark || correctedData.lessonPlanningMark || row.lessonPlanningMark,
      MAX.lessonFacilitationMark
    )
    base.lessonPlanningComment = String(row.lessonFacilitationComment || row.lessonPlanningComment || '').trim()

    base.personalDimensionsMark = clampNumber(
      correctedData.deportmentMark || row.deportmentMark || correctedData.personalDimensionsMark || row.personalDimensionsMark,
      MAX.deportmentMark
    )
    base.personalDimensionsComment = String(row.deportmentComment || row.personalDimensionsComment || '').trim()

    base.documentsMark = clampNumber(
      correctedData.recordsMark || row.recordsMark || correctedData.documentsMark || row.documentsMark,
      MAX.recordsMark
    )
    base.documentsComment = String(row.recordsComment || row.documentsComment || '').trim()

    base.environmentMark = clampNumber(correctedData.environmentMark || row.environmentMark, MAX.environmentMark)
    base.environmentComment = String(row.environmentComment || '').trim()

    base.communityMark = clampNumber(correctedData.communityMark || row.communityMark, MAX.communityMark)
    base.communityComment = String(row.communityComment || '').trim()

    base.conclusionMark = clampNumber(
      correctedData.remainingPillarsMark || row.remainingPillarsMark || correctedData.conclusionMark || row.conclusionMark,
      MAX.remainingPillarsMark
    )
    base.conclusionComment = String(row.remainingPillarsComment || row.conclusionComment || '').trim()

  } else if (formType === 'materials') {
    // Materials Development - use all 16 individual sub-fields
    // Content section (20%)
    base.contentRelevanceMark = clampNumber(row.contentRelevanceMark, MAX.contentRelevanceMark)
    base.contentRelevanceComment = String(row.contentRelevanceComment || '').trim()
    base.contentOrganizationMark = clampNumber(row.contentOrganizationMark, MAX.contentOrganizationMark)
    base.contentOrganizationComment = String(row.contentOrganizationComment || '').trim()

    // Pedagogical Value section (20%)
    base.pedagogicalAlignmentMark = clampNumber(row.pedagogicalAlignmentMark, MAX.pedagogicalAlignmentMark)
    base.pedagogicalAlignmentComment = String(row.pedagogicalAlignmentComment || '').trim()
    base.pedagogicalEngagementMark = clampNumber(row.pedagogicalEngagementMark, MAX.pedagogicalEngagementMark)
    base.pedagogicalEngagementComment = String(row.pedagogicalEngagementComment || '').trim()
    base.pedagogicalConnectionMark = clampNumber(row.pedagogicalConnectionMark, MAX.pedagogicalConnectionMark)
    base.pedagogicalConnectionComment = String(row.pedagogicalConnectionComment || '').trim()
    base.pedagogicalInclusiveMark = clampNumber(row.pedagogicalInclusiveMark, MAX.pedagogicalInclusiveMark)
    base.pedagogicalInclusiveComment = String(row.pedagogicalInclusiveComment || '').trim()

    // Design and Layout section (20%)
    base.designVisualMark = clampNumber(row.designVisualMark, MAX.designVisualMark)
    base.designVisualComment = String(row.designVisualComment || '').trim()
    base.designNavigationMark = clampNumber(row.designNavigationMark, MAX.designNavigationMark)
    base.designNavigationComment = String(row.designNavigationComment || '').trim()
    base.designQualityMark = clampNumber(row.designQualityMark, MAX.designQualityMark)
    base.designQualityComment = String(row.designQualityComment || '').trim()
    base.designConsistencyMark = clampNumber(row.designConsistencyMark, MAX.designConsistencyMark)
    base.designConsistencyComment = String(row.designConsistencyComment || '').trim()

    // Innovation and Creativity section (20%)
    base.innovationOriginalityMark = clampNumber(row.innovationOriginalityMark, MAX.innovationOriginalityMark)
    base.innovationOriginalityComment = String(row.innovationOriginalityComment || '').trim()
    base.innovationTechnologyMark = clampNumber(row.innovationTechnologyMark, MAX.innovationTechnologyMark)
    base.innovationTechnologyComment = String(row.innovationTechnologyComment || '').trim()

    // Education 5.0 Compliance section (20%)
    base.educationLocalMark = clampNumber(row.educationLocalMark, MAX.educationLocalMark)
    base.educationLocalComment = String(row.educationLocalComment || '').trim()
    base.educationHeritageMark = clampNumber(row.educationHeritageMark, MAX.educationHeritageMark)
    base.educationHeritageComment = String(row.educationHeritageComment || '').trim()
    base.educationProblemMark = clampNumber(row.educationProblemMark, MAX.educationProblemMark)
    base.educationProblemComment = String(row.educationProblemComment || '').trim()
    base.educationCommercialMark = clampNumber(row.educationCommercialMark, MAX.educationCommercialMark)
    base.educationCommercialComment = String(row.educationCommercialComment || '').trim()

  } else {
    // Default fallback - use standard field names
    base.preparationMark = clampNumber(correctedData.preparationMark || row.preparationMark, MAX.preparationMark)
    base.preparationComment = String(row.preparationComment || '').trim()
    base.lessonPlanningMark = clampNumber(correctedData.lessonPlanningMark || row.lessonPlanningMark, MAX.lessonPlanningMark)
    base.lessonPlanningComment = String(row.lessonPlanningComment || '').trim()
    base.environmentMark = clampNumber(correctedData.environmentMark || row.environmentMark, MAX.environmentMark)
    base.environmentComment = String(row.environmentComment || '').trim()
    base.documentsMark = clampNumber(correctedData.documentsMark || row.documentsMark, MAX.documentsMark)
    base.documentsComment = String(row.documentsComment || '').trim()
    base.introductionMark = clampNumber(correctedData.introductionMark || row.introductionMark, MAX.introductionMark)
    base.introductionComment = String(row.introductionComment || '').trim()
    base.developmentMark = clampNumber(correctedData.developmentMark || row.developmentMark, MAX.developmentMark)
    base.developmentComment = String(row.developmentComment || '').trim()
    base.conclusionMark = clampNumber(correctedData.conclusionMark || row.conclusionMark, MAX.conclusionMark)
    base.conclusionComment = String(row.conclusionComment || '').trim()
    base.personalDimensionsMark = clampNumber(correctedData.personalDimensionsMark || row.personalDimensionsMark, MAX.personalDimensionsMark)
    base.personalDimensionsComment = String(row.personalDimensionsComment || '').trim()
    base.communityMark = clampNumber(correctedData.communityMark || row.communityMark, MAX.communityMark)
    base.communityComment = String(row.communityComment || '').trim()
  }

  // Validate required fields
  if (!base.subject) throw new Error('Subject is required')
  if (!base.topic) throw new Error('Topic is required')

  return base
}

async function handleRow(row: ImportRow, currentSupervisorId: number) {
  const norm = normalizeRow(row)

  // Only candidate number is required from the Excel file
  if (!norm.candidateNo) {
    throw new Error('Student candidate number is required')
  }

  // Supervisor fields in the sheet are ignored; we attach to the logged-in supervisor
  const student = await upsertStudent(norm)
  const data = mapAssessmentData(norm)

  // Prevent obvious duplicates: same student + date + subject
  const existing = await prisma.assessment.findFirst({
    where: {
      studentId: student.id,
      subject: data.subject,
      assessmentDate: {
        gte: new Date(data.assessmentDate.getFullYear(), data.assessmentDate.getMonth(), data.assessmentDate.getDate()),
        lt: new Date(data.assessmentDate.getFullYear(), data.assessmentDate.getMonth(), data.assessmentDate.getDate() + 1),
      },
    },
  })

  if (existing) {
    await prisma.assessment.update({
      where: { id: existing.id },
      data: { ...data, supervisorId: currentSupervisorId, studentId: student.id },
    })
    return { status: 'updated', student: student.candidateNo, subject: data.subject, studentName: student.fullName }
  }

  await prisma.assessment.create({
    data: { ...data, supervisorId: currentSupervisorId, studentId: student.id },
  })
  return { status: 'created', student: student.candidateNo, subject: data.subject, studentName: student.fullName }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Check authentication - allow supervisors, admins, and superadmins
    const role = getCookie(event, 'role')
    if (!['supervisor', 'admin', 'superadmin'].includes(role)) {
      throw createError({ statusCode: 401, statusMessage: 'Authentication required to import assessments' })
    }

    let currentSupervisorId = 0

    if (role === 'supervisor') {
      const supervisorIdCookie = getCookie(event, 'supervisorId')
      currentSupervisorId = parseInt(String(supervisorIdCookie || '0'))
      if (!currentSupervisorId) {
        throw createError({ statusCode: 401, statusMessage: 'Missing supervisor session' })
      }
    } else {
      // For admins/superadmins, use the first available supervisor or create a system supervisor
      const firstSupervisor = await prisma.supervisor.findFirst()
      if (firstSupervisor) {
        currentSupervisorId = firstSupervisor.id
      } else {
        // Create a system supervisor for admin uploads
        const systemSupervisor = await prisma.supervisor.create({
          data: {
            fullName: 'System Administrator',
            email: 'system@madziwa.edu',
            nationalId: 'SYSTEM-ADMIN',
            phoneNumber: '0000000000'
          }
        })
        currentSupervisorId = systemSupervisor.id
      }
    }

    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    }

    const file = parts.find(p => p.name === 'file')
    if (!file || !file.data) {
      throw createError({ statusCode: 400, statusMessage: 'Missing file field' })
    }

    const workbook = XLSX.read(file.data, { type: 'buffer' })
    const sheetName = workbook.SheetNames.includes('Assessments') ? 'Assessments' : workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const rows: ImportRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    if (!rows.length) {
      throw createError({ statusCode: 400, statusMessage: 'No rows found in sheet' })
    }

    const results: any[] = []
    let created = 0, updated = 0, errors = 0

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      try {
        const res = await handleRow(row, currentSupervisorId)
        results.push({ row: i + 2, ...res }) // +2 accounts for 1-based index and header row
        if (res.status === 'created') created++
        if (res.status === 'updated') updated++
      } catch (err: any) {
        errors++
        const errorMsg = err?.message || String(err)
        console.error(`Error processing row ${i + 2}:`, errorMsg)
        results.push({ row: i + 2, status: 'error', error: errorMsg })
      }
    }

    const summary = {
      total: rows.length,
      created,
      updated,
      errors,
      results,
      success: errors === 0,
      message: errors > 0 ? `Import completed with ${errors} errors. Check details below.` : 'Import completed successfully!'
    }

    return summary
  } catch (error) {
    console.error('Error importing XLSX:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to import Excel file' })
  }
})

