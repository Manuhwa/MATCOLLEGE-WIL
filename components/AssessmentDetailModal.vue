<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div class="flex items-center gap-4 flex-wrap">
            <img src="/assets/images/madziwa-logo.png" alt="Madziwa Teachers College Logo" class="w-16 h-16 object-contain" />
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Assessment Details</h2>
              <p class="text-sm text-gray-600">{{ assessment?.student?.fullName }} - {{ assessment?.subject }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button 
              @click="$emit('download', assessment)"
              class="btn-primary"
              :disabled="loading"
            >
              <i class="pi pi-download mr-2"></i>
              Download PDF
            </button>
            <button 
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6" v-if="assessment">
        <!-- Assessment Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Student Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="pi pi-user mr-2 text-blue-600"></i>
              Student Information
            </h3>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-600">Full Name</label>
                <p class="text-gray-900">{{ assessment.student.fullName }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Candidate Number</label>
                <p class="text-gray-900">{{ assessment.student.candidateNo }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Email</label>
                <p class="text-gray-900">{{ assessment.student.email }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">School</label>
                <p class="text-gray-900">{{ assessment.student.schoolName }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Class</label>
                <p class="text-gray-900">{{ assessment.student.className }}</p>
              </div>
            </div>
          </div>

          <!-- Supervisor Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <i class="pi pi-user-edit mr-2 text-purple-600"></i>
              Supervisor Information
            </h3>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-600">Full Name</label>
                <p class="text-gray-900">{{ assessment.supervisor.fullName }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Email</label>
                <p class="text-gray-900">{{ assessment.supervisor.email }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">Phone Number</label>
                <p class="text-gray-900">{{ assessment.supervisor.phoneNumber }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600">National ID</label>
                <p class="text-gray-900">{{ assessment.supervisor.nationalId }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Assessment Details -->
        <div class="bg-gray-50 rounded-lg p-4 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="pi pi-file-text mr-2 text-green-600"></i>
            Assessment Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Subject</label>
              <p class="text-gray-900">{{ assessment.subject }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Topic</label>
              <p class="text-gray-900">{{ assessment.topic }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Assessment Date</label>
              <p class="text-gray-900">{{ formatDate(assessment.assessmentDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Scoring Breakdown -->
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="pi pi-chart-bar mr-2 text-orange-600"></i>
              Scoring Breakdown
            </h3>
          </div>
          
          <!-- Materials Development categories -->
          <div v-if="assessment.formType === 'materials'" class="divide-y divide-gray-200">
            <!-- Content (20) -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Content</h4>
                <span class="text-lg font-semibold text-blue-600">{{ assessment.preparationMark }}/20</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (assessment.preparationMark / 20 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.preparationComment }}</p>
            </div>

            <!-- Pedagogical Value (20) -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Pedagogical Value</h4>
                <span class="text-lg font-semibold text-blue-600">{{ assessment.lessonPlanningMark }}/20</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (assessment.lessonPlanningMark / 20 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.lessonPlanningComment }}</p>
            </div>

            <!-- Design & Layout (20) -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Design & Layout</h4>
                <span class="text-lg font-semibold text-blue-600">{{ assessment.environmentMark }}/20</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (assessment.environmentMark / 20 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.environmentComment }}</p>
            </div>

            <!-- Innovation & Creativity (20) -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Innovation & Creativity</h4>
                <span class="text-lg font-semibold text-blue-600">{{ assessment.documentsMark }}/20</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (assessment.documentsMark / 20 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.documentsComment }}</p>
            </div>

            <!-- Education 5.0 Compliance (20) -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Education 5.0 Compliance</h4>
                <span class="text-lg font-semibold text-blue-600">{{ assessment.introductionMark }}/20</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (assessment.introductionMark / 20 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.introductionComment }}</p>
            </div>
          </div>

          <!-- Junior Level breakdown -->
          <div v-else-if="assessment.formType === 'junior'" class="divide-y divide-gray-200">
            <!-- Research-Teaching & Learning - Preparation -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Preparation</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.preparationMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.preparationMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.preparationComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Lesson Facilitation -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Lesson Facilitation</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.lessonPlanningMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.lessonPlanningMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.lessonPlanningComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Deportment -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Deportment</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.personalDimensionsMark, 5) }}/5</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.personalDimensionsMark, 5) / 5 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.personalDimensionsComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Records Management -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Records Management</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.documentsMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.documentsMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.documentsComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Teaching and Learning Environment -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Teaching and Learning Environment</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.environmentMark, 10) }}/10</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.environmentMark, 10) / 10 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.environmentComment }}</p>
            </div>

            <!-- Selected Research Category -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">
                  {{ getSelectedResearchCategoryName(assessment.selectedResearchCategory) }} (Selected Category)
                </h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.communityMark, 30) }}/30</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.communityMark, 30) / 30 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.communityComment }}</p>
            </div>

            <!-- Remaining 2 Pillars -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Remaining 2 Pillars</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.conclusionMark, 10) }}/10</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.conclusionMark, 10) / 10 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.conclusionComment }}</p>
              <div class="mt-2 text-xs text-gray-500">
                <div v-if="assessment.selectedResearchCategory === 'community_service'">
                  <div>• Research & Innovation</div>
                  <div>• Research & Industrialisation</div>
                </div>
                <div v-else-if="assessment.selectedResearchCategory === 'innovation'">
                  <div>• Research-based Community Service</div>
                  <div>• Research & Industrialisation</div>
                </div>
                <div v-else-if="assessment.selectedResearchCategory === 'industrialisation'">
                  <div>• Research-based Community Service</div>
                  <div>• Research & Innovation</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ECD Level breakdown -->
          <div v-else-if="assessment.formType === 'ecd'" class="divide-y divide-gray-200">
            <!-- Research-Teaching & Learning - Preparation -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Preparation</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.preparationMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.preparationMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.preparationComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Lesson Facilitation -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Lesson Facilitation</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.lessonPlanningMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.lessonPlanningMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.lessonPlanningComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Deportment -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Deportment</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.personalDimensionsMark, 5) }}/5</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.personalDimensionsMark, 5) / 5 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.personalDimensionsComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Records Management -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Records Management</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.documentsMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.documentsMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.documentsComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Teaching and Learning Environment -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Teaching and Learning Environment</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.environmentMark, 10) }}/10</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.environmentMark, 10) / 10 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.environmentComment }}</p>
            </div>

            <!-- Selected Research Category -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">
                  {{ getSelectedResearchCategoryName(assessment.selectedResearchCategory) }} (Selected Category)
                </h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.communityMark, 30) }}/30</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.communityMark, 30) / 30 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.communityComment }}</p>
            </div>

            <!-- Remaining 2 Pillars -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Remaining 2 Pillars</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.conclusionMark, 10) }}/10</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.conclusionMark, 10) / 10 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.conclusionComment }}</p>
              <div class="mt-2 text-xs text-gray-500">
                <div v-if="assessment.selectedResearchCategory === 'community_service'">
                  <div>• Research & Innovation</div>
                  <div>• Research & Industrialisation</div>
                </div>
                <div v-else-if="assessment.selectedResearchCategory === 'innovation'">
                  <div>• Research-based Child Study & Community Service</div>
                  <div>• Research & Industrialisation</div>
                </div>
                <div v-else-if="assessment.selectedResearchCategory === 'industrialisation'">
                  <div>• Research-based Child Study & Community Service</div>
                  <div>• Research & Innovation</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other breakdown (for non-ECD, non-Junior, non-Materials) -->
          <div v-else class="divide-y divide-gray-200">
            <!-- Research-Teaching & Learning - Preparation -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Preparation</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.preparationMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.preparationMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.preparationComment }}</p>
            </div>

            <!-- Research-Teaching & Learning - Lesson Facilitation -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Research-Teaching & Learning - Lesson Facilitation</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.lessonPlanningMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.lessonPlanningMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.lessonPlanningComment }}</p>
            </div>

            <!-- Learning Environment & Management -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Learning Environment & Management</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.environmentMark, 10) }}/10</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.environmentMark, 10) / 10 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.environmentComment }}</p>
            </div>

            <!-- Other Work-Related Learning Documents -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Other Work-Related Learning Documents</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.documentsMark, 15) }}/15</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.documentsMark, 15) / 15 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.documentsComment }}</p>
            </div>

            <!-- Lesson Presentation: Introduction -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Lesson Presentation: Introduction</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.introductionMark, 5) }}/5</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.introductionMark, 5) / 5 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.introductionComment }}</p>
            </div>

            <!-- Lesson Presentation: Development -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Lesson Presentation: Development</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.developmentMark, 30) }}/30</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.developmentMark, 30) / 30 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.developmentComment }}</p>
            </div>

            <!-- Remaining 2 Pillars -->
            <div class="px-6 py-4">
              <div class="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h4 class="font-medium text-gray-900">Remaining 2 Pillars</h4>
                <span class="text-lg font-semibold text-blue-600">{{ Math.min(assessment.conclusionMark, 10) }}/10</span>
              </div>
              <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: (Math.min(assessment.conclusionMark, 10) / 10 * 100) + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600">{{ assessment.conclusionComment }}</p>
            </div>
          </div>
        </div>

        <!-- Overall Comment -->
        <div class="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="pi pi-comments mr-2 text-indigo-600"></i>
            Overall Comment
          </h3>
          <p class="text-gray-700 leading-relaxed">{{ assessment.overallComment }}</p>
        </div>

        <!-- Total Score -->
        <div class="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h3 class="text-xl font-semibold">Total Score</h3>
              <p class="text-blue-100">Out of 100 points</p>
            </div>
            <div class="text-right">
              <div class="text-4xl font-bold">{{ assessment.totalMark }}/100</div>
              <div class="text-blue-100">{{ getGrade(assessment.totalMark) }}</div>
            </div>
          </div>
          <div class="mt-4 bg-white bg-opacity-20 rounded-full h-3">
            <div 
              class="bg-white h-3 rounded-full"
              :style="{ width: assessment.totalMark + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 flex-wrap">
        <button 
          @click="$emit('close')"
          class="btn-secondary"
        >
          Close
        </button>
        <button 
          @click="$emit('download', assessment)"
          class="btn-primary"
          :disabled="loading"
        >
          <i class="pi pi-download mr-2"></i>
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  assessment: {
    type: Object,
    required: true
  }
})

// Function to get the display name for selected research category
const getSelectedResearchCategoryName = (category) => {
  switch (category) {
    case 'community_service':
      return 'Research-based Child Study & Community Service'
    case 'innovation':
      return 'Research & Innovation'
    case 'industrialisation':
      return 'Research & Industrialisation'
    default:
      return 'Research Category'
  }
}

// Emits
const emit = defineEmits(['close', 'download'])

// Reactive data
const loading = ref(false)

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getGrade = (score) => {
  if (score >= 80) return '1'
  if (score >= 70) return '2.1'
  if (score >= 60) return '2.2'
  if (score >= 50) return '3'
  return 'F'
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}
</style> 