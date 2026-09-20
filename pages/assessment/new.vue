<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-sm border p-8 mb-8">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Work Integrated Learning Assessment Instrument</h1>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">MADZIWA TEACHERS COLLEGE</h2>
          <h3 class="text-lg font-medium text-gray-700 mb-6">CENTRE FOR TEACHER EDUCATION AND MATERIALS DEVELOPMENT</h3>
          <div class="text-base text-gray-600">
            <div v-if="assessmentType === 'ecd'">DE: EXTERNAL EXAMINING INSTRUMENT: ECD LEVEL</div>
            <div v-else-if="assessmentType === 'junior'">DE: EXTERNAL EXAMINING INSTRUMENT: JUNIOR LEVEL</div>
            <div v-else-if="assessmentType === 'secondary'">DIPLOMA IN EDUCATION<br>EXTERNAL EXAMINING INSTRUMENT: SECONDARY LEVEL</div>
            <div v-else-if="assessmentType === 'isen'">FACULTY OF EDUCATION<br>CENTRE FOR TEACHER EDUCATION AND MATERIALS DEVELOPMENT<br>DIPLOMA IN EDUCATION<br>WORK INTEGRATED EXAMINING FORM<br>INCLUSION AND SPECIAL EDUCATIONAL NEEDS (ISEN)</div>
            <div v-else-if="assessmentType === 'materials'">MATERIALS DEVELOPMENT ASSESSMENT INSTRUMENT</div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitAssessment" novalidate class="space-y-8">

        <!-- Selected Criteria Assessment (if criteria are pre-selected) -->
        <SelectedCriteriaAssessment
          v-if="selectedCriteria.length > 0"
          :assessment-type="assessmentType"
          :selected-criteria="selectedCriteria"
          :form="form"
        />
        <!-- Assessment Type -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Assessment Type</h2>
          <p class="text-sm text-gray-500 mb-6">Select the type of assessment you want to conduct</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- ECD Level -->
            <div 
              @click="assessmentType = 'ecd'"
              class="relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
              :class="assessmentType === 'ecd' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg ring-2 ring-emerald-500 ring-offset-2' 
                : 'bg-white border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'"
            >
              <div v-if="assessmentType === 'ecd'" class="absolute top-2 right-2">
                <i class="pi pi-check-circle text-white text-lg"></i>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" 
                  :class="assessmentType === 'ecd' ? 'bg-white/20' : 'bg-emerald-100 group-hover:bg-emerald-200'">
                  <i class="pi pi-heart text-xl" :class="assessmentType === 'ecd' ? 'text-white' : 'text-emerald-600'"></i>
                </div>
              </div>
              <h3 class="font-bold text-lg mb-1" :class="assessmentType === 'ecd' ? 'text-white' : 'text-gray-900'">ECD Level</h3>
              <p class="text-sm leading-relaxed" :class="assessmentType === 'ecd' ? 'text-emerald-100' : 'text-gray-500'">Early Childhood Development</p>
            </div>

            <!-- Junior Level -->
            <div 
              @click="assessmentType = 'junior'"
              class="relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
              :class="assessmentType === 'junior' 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg ring-2 ring-blue-500 ring-offset-2' 
                : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
            >
              <div v-if="assessmentType === 'junior'" class="absolute top-2 right-2">
                <i class="pi pi-check-circle text-white text-lg"></i>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="assessmentType === 'junior' ? 'bg-white/20' : 'bg-blue-100 group-hover:bg-blue-200'">
                  <i class="pi pi-users text-xl" :class="assessmentType === 'junior' ? 'text-white' : 'text-blue-600'"></i>
                </div>
              </div>
              <h3 class="font-bold text-lg mb-1" :class="assessmentType === 'junior' ? 'text-white' : 'text-gray-900'">Junior Level</h3>
              <p class="text-sm leading-relaxed" :class="assessmentType === 'junior' ? 'text-blue-100' : 'text-gray-500'">Primary School Teaching</p>
            </div>

            <!-- Secondary Level -->
            <div 
              @click="assessmentType = 'secondary'"
              class="relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
              :class="assessmentType === 'secondary' 
                ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg ring-2 ring-purple-500 ring-offset-2' 
                : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'"
            >
              <div v-if="assessmentType === 'secondary'" class="absolute top-2 right-2">
                <i class="pi pi-check-circle text-white text-lg"></i>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="assessmentType === 'secondary' ? 'bg-white/20' : 'bg-purple-100 group-hover:bg-purple-200'">
                  <i class="pi pi-graduation-cap text-xl" :class="assessmentType === 'secondary' ? 'text-white' : 'text-purple-600'"></i>
                </div>
              </div>
              <h3 class="font-bold text-lg mb-1" :class="assessmentType === 'secondary' ? 'text-white' : 'text-gray-900'">Secondary</h3>
              <p class="text-sm leading-relaxed" :class="assessmentType === 'secondary' ? 'text-purple-100' : 'text-gray-500'">High School Teaching</p>
            </div>

            <!-- ISEN -->
            <div 
              @click="assessmentType = 'isen'"
              class="relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
              :class="assessmentType === 'isen' 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg ring-2 ring-amber-500 ring-offset-2' 
                : 'bg-white border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50'"
            >
              <div v-if="assessmentType === 'isen'" class="absolute top-2 right-2">
                <i class="pi pi-check-circle text-white text-lg"></i>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="assessmentType === 'isen' ? 'bg-white/20' : 'bg-amber-100 group-hover:bg-amber-200'">
                  <i class="pi pi-star text-xl" :class="assessmentType === 'isen' ? 'text-white' : 'text-amber-600'"></i>
                </div>
              </div>
              <h3 class="font-bold text-lg mb-1" :class="assessmentType === 'isen' ? 'text-white' : 'text-gray-900'">ISEN</h3>
              <p class="text-sm leading-relaxed" :class="assessmentType === 'isen' ? 'text-amber-100' : 'text-gray-500'">Special Educational Needs</p>
            </div>

            <!-- Materials Development -->
            <div 
              @click="assessmentType = 'materials'"
              class="relative p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group"
              :class="assessmentType === 'materials' 
                ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg ring-2 ring-rose-500 ring-offset-2' 
                : 'bg-white border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50'"
            >
              <div v-if="assessmentType === 'materials'" class="absolute top-2 right-2">
                <i class="pi pi-check-circle text-white text-lg"></i>
              </div>
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="assessmentType === 'materials' ? 'bg-white/20' : 'bg-rose-100 group-hover:bg-rose-200'">
                  <i class="pi pi-book text-xl" :class="assessmentType === 'materials' ? 'text-white' : 'text-rose-600'"></i>
                </div>
              </div>
              <h3 class="font-bold text-lg mb-1" :class="assessmentType === 'materials' ? 'text-white' : 'text-gray-900'">Materials</h3>
              <p class="text-sm leading-relaxed" :class="assessmentType === 'materials' ? 'text-rose-100' : 'text-gray-500'">Educational Resources</p>
            </div>
          </div>
        </div>

        <!-- Supervisor Details -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Supervisor Details</h2>
            <span v-if="supervisorAutoFilled" class="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
              Loaded from your account
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input v-model="supervisor.fullName" type="text" placeholder="start by surname" :readonly="supervisorAutoFilled" :class="supervisorAutoFilled ? 'bg-gray-50 cursor-not-allowed' : ''" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input v-model="supervisor.nationalId" type="text" placeholder="e.g. 63-123433322X18" :readonly="supervisorAutoFilled" :class="supervisorAutoFilled ? 'bg-gray-50 cursor-not-allowed' : ''" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="supervisor.phoneNumber" type="tel" placeholder="e.g.+263 777 000 000" :readonly="supervisorAutoFilled" :class="supervisorAutoFilled ? 'bg-gray-50 cursor-not-allowed' : ''" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="supervisor.email" type="email" placeholder="e.g.supervisor@gmail.com" :readonly="supervisorAutoFilled" :class="supervisorAutoFilled ? 'bg-gray-50 cursor-not-allowed' : ''" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>
          <p v-if="!supervisorAutoFilled" class="text-xs text-gray-500 mt-3">
            Couldn't load your saved details (you may be offline) - please fill these in manually.
          </p>
        </div>

        <!-- Student Search -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Find Student</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search by SRN</label>
              <input v-model="studentSearch.srn" type="text" placeholder="e.g.23/002/2024" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Or Surname</label>
              <input v-model="studentSearch.surname" type="text" placeholder="Surname" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-1">
              <button type="button" @click="searchStudents" :disabled="searching" class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                <i v-if="searching" class="pi pi-spinner pi-spin mr-2"></i>
                Search
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="studentsResults.length" class="mt-4 border rounded-lg divide-y">
            <div v-for="s in studentsResults" :key="s.id" class="p-3 flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900">{{ s.fullName }} <span class="text-gray-500">({{ s.candidateNo }})</span></div>
                <div class="text-sm text-gray-600">{{ s.schoolName }} • {{ s.className }} • {{ s.email }}</div>
              </div>
              <button type="button" @click="selectStudent(s)" class="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700">Select</button>
            </div>
          </div>

          <!-- Or enter student details manually -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-900">Student Details</h3>
              <span v-if="selectedStudentId" class="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">Selected from search</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input v-model="student.fullName" type="text" placeholder="start by surname" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select v-model="student.sex" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Candidate number (SRN)</label>
                <input v-model="student.candidateNo" type="text" placeholder="23/002/24" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="student.email" type="email" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">School name</label>
                <input v-model="student.schoolName" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input v-model="student.className" type="text" placeholder="Grade 4Blue" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </div>
        </div>

        <!-- Assessment Details -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Assessment Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                v-model="form.subject"
                type="text"
                required
                placeholder="e.g., Mathematics"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                v-model="form.topic"
                type="text"
                required
                placeholder="e.g., Addition and Subtraction"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Assessment Date</label>
              <input
                v-model="form.assessmentDate"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Education 5.0 Pillar Assessment -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Education 5.0 Pillar Assessment</h2>
          
          <!-- ECD Level Form -->
          <div v-if="assessmentType === 'ecd'" class="space-y-6">
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Research-Teaching & Learning - Preparation -->
                  <tr>
                    <td rowspan="5" class="border border-gray-300 px-4 py-2 align-top font-medium">Research-Teaching & Learning</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Preparation</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Portfolio of evidence</li>
                        <li>• Scheming</li>
                        <li>• Lesson planning</li>
                        <li>• Evaluation</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Lesson Facilitation</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Introduction</li>
                        <li>• Questioning techniques and distribution</li>
                        <li>• Sequencing of learning</li>
                        <li>• Knowledge of content</li>
                        <li>• Appropriate media use</li>
                        <li>• Evidence of research</li>
                        <li>• Assessment and feedback</li>
                        <li>• Lesson conclusion</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.lessonFacilitationComment" rows="4" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.lessonFacilitationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Deportment</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Dress code</li>
                        <li>• Voice projection</li>
                        <li>• Language use</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.deportmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">5%</div>
                    </td>
                  </tr>
                  <!-- Research-Teaching & Learning - Records Management -->
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Records management</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Register</li>
                        <li>• Progress Record</li>
                        <li>• Individual Social Record</li>
                        <li>• Remedial</li>
                        <li>• Extension work</li>
                        <li>• Reading</li>
                        <li>• Inventory Record</li>
                        <li>• Test Record</li>
                        <li>• WIL File</li>
                        <li>• Anecdotal</li>
                        <li>• Developmental Checklist</li>
                        <li>• Health Record</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.recordsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.recordsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <!-- Research-Teaching & Learning - Teaching and learning environment -->
                  <tr>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Teaching and learning environment</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Classroom layout and conduciveness</li>
                        <li>• Management of learning centres</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.environmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.environmentMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                      <div class="text-xs text-gray-500 mt-1">10%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Child Study & Community Service/ Research & Innovation/Research & Industrialisation</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="space-y-2">
                        <label class="flex items-center text-sm">
                          <input v-model="form.selectedResearchCategory" type="radio" value="community_service" class="mr-2" />
                          Research-based Child Study & Community Service
                        </label>
                        <label class="flex items-center text-sm">
                          <input v-model="form.selectedResearchCategory" type="radio" value="innovation" class="mr-2" />
                          Research & Innovation
                        </label>
                        <label class="flex items-center text-sm">
                          <input v-model="form.selectedResearchCategory" type="radio" value="industrialisation" class="mr-2" />
                          Research & Industrialisation
                        </label>
                      </div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" placeholder="Enter observations..." :disabled="!form.selectedResearchCategory"></textarea>
                      <div v-if="!form.selectedResearchCategory" class="text-xs text-red-600 mt-1 font-semibold">⚠️ Select a research category above to enable (Required for ECD)</div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" :disabled="!form.selectedResearchCategory" />
                      <div class="text-xs text-gray-500 mt-1">30% (Selected Category)</div>
                      <div v-if="!form.selectedResearchCategory" class="text-xs text-red-600 mt-1 font-semibold">⚠️ Select a research category above to enable (Required for ECD)</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Remaining 2 pillars</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div v-if="form.selectedResearchCategory" class="text-sm text-gray-600">
                        <div v-if="form.selectedResearchCategory === 'community_service'">
                          <div>• Research & Innovation</div>
                          <div>• Research & Industrialisation</div>
                        </div>
                        <div v-else-if="form.selectedResearchCategory === 'innovation'">
                          <div>• Research-based Child Study & Community Service</div>
                          <div>• Research & Industrialisation</div>
                        </div>
                        <div v-else-if="form.selectedResearchCategory === 'industrialisation'">
                          <div>• Research-based Child Study & Community Service</div>
                          <div>• Research & Innovation</div>
                        </div>
                      </div>
                      <div v-else class="text-sm text-gray-500">Select a category above to see remaining pillars</div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" placeholder="Enter observations..." :disabled="!form.selectedResearchCategory"></textarea>
                      <div v-if="!form.selectedResearchCategory" class="text-xs text-gray-500 mt-1">Select a category above to enable</div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" :disabled="!form.selectedResearchCategory" />
                      <div class="text-xs text-gray-500 mt-1">10% (5% each for remaining 2 categories)</div>
                      <div v-if="!form.selectedResearchCategory" class="text-xs text-gray-500 mt-1">Select a category above to enable</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>

          <!-- Junior Level Form -->
          <div v-if="assessmentType === 'junior'" class="space-y-6">
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Research-Teaching & Learning</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Preparation</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Portfolio of evidence</li>
                        <li>• Scheming</li>
                        <li>• Lesson planning</li>
                        <li>• Evaluation</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2"></td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Lesson Facilitation</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Introduction</li>
                        <li>• Questioning techniques and distribution</li>
                        <li>• Sequencing of learning</li>
                        <li>• Knowledge of content</li>
                        <li>• Appropriate media use</li>
                        <li>• Evidence of research</li>
                        <li>• Assessment and feedback</li>
                        <li>• Lesson conclusion</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.lessonPlanningComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.lessonPlanningMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2"></td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Deportment</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Dress code</li>
                        <li>• Voice projection</li>
                        <li>• Language use</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.deportmentComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">5%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2"></td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Records management</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Register</li>
                        <li>• Progress Record</li>
                        <li>• Individual Social Record</li>
                        <li>• Remedial</li>
                        <li>• Extension work</li>
                        <li>• Reading</li>
                        <li>• Inventory Record</li>
                        <li>• Test Record</li>
                        <li>• WIL File</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.documentsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.documentsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">15%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2"></td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Teaching and learning environment</div>
                      <ul class="text-sm text-gray-600 mt-1">
                        <li>• Classroom layout and conduciveness</li>
                        <li>• Management of learning centres</li>
                      </ul>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.environmentComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.environmentMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">10%</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Community Service/ Research & Innovation/Research & Industrialisation</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="space-y-2">
                        <label class="flex items-center text-sm">
                          <input v-model="form.selectedResearchCategory" type="radio" value="community_service" class="mr-2" />
                          Research-based Community Service
                        </label>
                        <label class="flex items-center text-sm">
                          <input v-model="form.selectedResearchCategory" type="radio" value="innovation" class="mr-2" />
                          Research & Innovation
                        </label>
                        <label class="flex items-center text-sm">
                          <input v-model="form.selectedResearchCategory" type="radio" value="industrialisation" class="mr-2" />
                          Research & Industrialisation
                        </label>
                      </div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" placeholder="Enter observations..." :disabled="!form.selectedResearchCategory"></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" :disabled="!form.selectedResearchCategory" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">30% (Selected Category)</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-4 py-2"></td>
                    <td class="border border-gray-300 px-4 py-2">
                      <div class="font-medium">Remaining 2 pillars</div>
                      <div v-if="form.selectedResearchCategory" class="text-sm text-gray-600 mt-2">
                        <div v-if="form.selectedResearchCategory === 'community_service'">
                          <div>• Research & Innovation</div>
                          <div>• Research & Industrialisation</div>
                        </div>
                        <div v-else-if="form.selectedResearchCategory === 'innovation'">
                          <div>• Research-based Community Service</div>
                          <div>• Research & Industrialisation</div>
                        </div>
                        <div v-else-if="form.selectedResearchCategory === 'industrialisation'">
                          <div>• Research-based Community Service</div>
                          <div>• Research & Innovation</div>
                        </div>
                      </div>
                      <div v-else class="text-sm text-gray-500">Select a category above to see remaining pillars</div>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" placeholder="Enter observations..." :disabled="!form.selectedResearchCategory"></textarea>
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                      <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" :disabled="!form.selectedResearchCategory" @input="calculateJuniorTotal" />
                      <div class="text-xs text-gray-500 mt-1">10% (5% each for remaining 2 categories)</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Secondary Level Form -->
        <div v-if="assessmentType === 'secondary'" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Secondary Level Assessment</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="3" class="border border-gray-300 px-4 py-2 align-top font-medium">Research-Teaching & Learning</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">PREPARATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Portfolio of evidence</li>
                      <li>• Scheming</li>
                      <li>• Lesson planning</li>
                      <li>• Evaluation</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">RECORDS MANAGEMENT</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Register</li>
                      <li>• Progress Record</li>
                      <li>• Individual Social Record</li>
                      <li>• Remedial</li>
                      <li>• Extension work</li>
                      <li>• Reading</li>
                      <li>• Inventory Record</li>
                      <li>• Test Record</li>
                      <li>• WIL File</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.recordsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.recordsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">LESSON FACILITATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Introduction</li>
                      <li>• Questioning techniques and distribution</li>
                      <li>• Sequencing of learning</li>
                      <li>• Knowledge of content</li>
                      <li>• Appropriate media use</li>
                      <li>• Evidence of research</li>
                      <li>• Assessment and feedback</li>
                      <li>• Lesson conclusion</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.lessonFacilitationComment" rows="4" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.lessonFacilitationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Deportment</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="text-sm text-gray-600">
                      <li>• Dress code</li>
                      <li>• Voice projection</li>
                      <li>• Language use</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.deportmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Child Study & Community Service/ Research & Innovation/Research & Industrialisation</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="space-y-2">
                      <label class="flex items-center text-sm">
                        <input v-model="form.selectedResearchCategory" type="radio" value="community_service" class="mr-2" />
                        Research-based Child Study & Community Service
                      </label>
                      <label class="flex items-center text-sm">
                        <input v-model="form.selectedResearchCategory" type="radio" value="innovation" class="mr-2" />
                        Research & Innovation
                      </label>
                      <label class="flex items-center text-sm">
                        <input v-model="form.selectedResearchCategory" type="radio" value="industrialisation" class="mr-2" />
                        Research & Industrialisation
                      </label>
                    </div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" placeholder="Enter observations..." :disabled="!form.selectedResearchCategory"></textarea>
                    <div v-if="!form.selectedResearchCategory" class="text-xs text-gray-500 mt-1">Select a category above to enable</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" :disabled="!form.selectedResearchCategory" />
                    <div class="text-xs text-gray-500 mt-1">30% (Selected Category)</div>
                    <div v-if="!form.selectedResearchCategory" class="text-xs text-gray-500 mt-1">Select a category above to enable</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Remaining 2 pillars</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div v-if="form.selectedResearchCategory" class="text-sm text-gray-600">
                      <div v-if="form.selectedResearchCategory === 'community_service'">
                        <div>• Research & Innovation</div>
                        <div>• Research & Industrialisation</div>
                      </div>
                      <div v-else-if="form.selectedResearchCategory === 'innovation'">
                        <div>• Research-based Child Study & Community Service</div>
                        <div>• Research & Industrialisation</div>
                      </div>
                      <div v-else-if="form.selectedResearchCategory === 'industrialisation'">
                        <div>• Research-based Child Study & Community Service</div>
                        <div>• Research & Innovation</div>
                      </div>
                    </div>
                    <div v-else class="text-sm text-gray-500">Select a category above to see remaining pillars</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" placeholder="Enter observations..." :disabled="!form.selectedResearchCategory"></textarea>
                    <div v-if="!form.selectedResearchCategory" class="text-xs text-gray-500 mt-1">Select a category above to enable</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" :class="{ 'bg-gray-100 cursor-not-allowed': !form.selectedResearchCategory }" :disabled="!form.selectedResearchCategory" />
                    <div class="text-xs text-gray-500 mt-1">10% (5% each for remaining 2 categories)</div>
                    <div v-if="!form.selectedResearchCategory" class="text-xs text-gray-500 mt-1">Select a category above to enable</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ISEN Form -->
        <div v-if="assessmentType === 'isen'" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">ISEN Assessment</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Education 5.0 Pillar</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="3" class="border border-gray-300 px-4 py-2 align-top font-medium">Research-Teaching & Learning</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">PREPARATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Portfolio of evidence</li>
                      <li>• Scheming</li>
                      <li>• Lesson planning</li>
                      <li>• Evaluation</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.preparationComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.preparationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">RECORDS MANAGEMENT</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Register</li>
                      <li>• Progress Record</li>
                      <li>• Individual Social Record</li>
                      <li>• Remedial</li>
                      <li>• Extension work</li>
                      <li>• Reading</li>
                      <li>• Inventory Record</li>
                      <li>• Test Record</li>
                      <li>• WIL File</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.recordsComment" rows="3" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.recordsMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">LESSON FACILITATION</div>
                    <ul class="text-sm text-gray-600 mt-1">
                      <li>• Introduction</li>
                      <li>• Questioning techniques and distribution</li>
                      <li>• Sequencing of learning</li>
                      <li>• Knowledge of content</li>
                      <li>• Appropriate media use</li>
                      <li>• Evidence of research</li>
                      <li>• Assessment and feedback</li>
                      <li>• Lesson conclusion</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.lessonFacilitationComment" rows="4" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.lessonFacilitationMark" type="number" min="0" max="15" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">15%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">DEPORTMENT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="text-sm text-gray-600">
                      <li>• Dress code</li>
                      <li>• Voice projection</li>
                      <li>• Language use</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.deportmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.deportmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">LEARNING ENVIRONMENT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="text-sm text-gray-600">
                      <li>• Classroom layout and conduciveness</li>
                      <li>• Management of learning centres</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.environmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.environmentMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Research-based Community engagement</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="text-sm text-gray-600">[Tick Applicable]</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.communityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.communityMark" type="number" min="0" max="30" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">30%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2 font-medium">Remaining 2 pillars</td>
                  <td class="border border-gray-300 px-4 py-2"></td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.remainingPillarsComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.remainingPillarsMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Materials Development Form -->
        <div v-if="assessmentType === 'materials'" class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Materials Development Assessment</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Category</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Aspect</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Observations</th>
                  <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowspan="2" class="border border-gray-300 px-4 py-2 align-top font-medium">CONTENT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Relevance to curriculum</div>
                    <div class="text-sm text-gray-600">Alignment with curriculum objectives and learning outcomes</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.contentRelevanceComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.contentRelevanceMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Organization and structure</div>
                    <div class="text-sm text-gray-600">Logical flow and clear organization of content</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.contentOrganizationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.contentOrganizationMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">PEDAGOGICAL VALUE</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Alignment with teaching methods</div>
                    <div class="text-sm text-gray-600">Compatibility with effective teaching strategies</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalAlignmentComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalAlignmentMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Student engagement</div>
                    <div class="text-sm text-gray-600">Potential to engage and motivate students</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalEngagementComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalEngagementMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Connection to real-world</div>
                    <div class="text-sm text-gray-600">Relevance to practical applications</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalConnectionComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalConnectionMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Inclusive design</div>
                    <div class="text-sm text-gray-600">Accessibility and inclusivity considerations</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.pedagogicalInclusiveComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.pedagogicalInclusiveMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">DESIGN AND LAYOUT</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Visual appeal</div>
                    <div class="text-sm text-gray-600">Aesthetic quality and visual design</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designVisualComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designVisualMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Navigation and usability</div>
                    <div class="text-sm text-gray-600">Ease of use and navigation</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designNavigationComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designNavigationMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Quality of production</div>
                    <div class="text-sm text-gray-600">Technical quality and finish</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designQualityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designQualityMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Consistency</div>
                    <div class="text-sm text-gray-600">Consistent design elements and branding</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.designConsistencyComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.designConsistencyMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="2" class="border border-gray-300 px-4 py-2 align-top font-medium">INNOVATION AND CREATIVITY</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Originality</div>
                    <div class="text-sm text-gray-600">Uniqueness and creative approach</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.innovationOriginalityComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.innovationOriginalityMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Technology integration</div>
                    <div class="text-sm text-gray-600">Effective use of technology</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.innovationTechnologyComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.innovationTechnologyMark" type="number" min="0" max="10" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">10%</div>
                  </td>
                </tr>
                <tr>
                  <td rowspan="4" class="border border-gray-300 px-4 py-2 align-top font-medium">EDUCATION 5.0 COMPLIANCE</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Local relevance</div>
                    <div class="text-sm text-gray-600">Alignment with local context and needs</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationLocalComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationLocalMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Heritage preservation</div>
                    <div class="text-sm text-gray-600">Cultural heritage integration</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationHeritageComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationHeritageMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Problem-solving focus</div>
                    <div class="text-sm text-gray-600">Addressing real-world problems</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationProblemComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationProblemMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">
                    <div class="font-medium">Commercial viability</div>
                    <div class="text-sm text-gray-600">Potential for commercialization</div>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <textarea v-model="form.educationCommercialComment" rows="2" class="w-full px-2 py-1 border rounded text-sm" placeholder="Enter observations..."></textarea>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <input v-model.number="form.educationCommercialMark" type="number" min="0" max="5" class="w-20 px-2 py-1 border rounded text-center" />
                    <div class="text-xs text-gray-500 mt-1">5%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Media Bag Warning -->
          <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center">
              <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
              <span class="font-medium text-yellow-800">Media Bag Warning</span>
            </div>
            <p class="text-sm text-yellow-700 mt-1">
              Ensure all materials are properly packaged and labeled for distribution. Check for completeness and quality before final submission.
            </p>
          </div>
        </div>

        <!-- General Comment -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">General Comment</h2>
          <textarea 
            v-model="form.overallComment" 
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your general comment..."
          ></textarea>
        </div>

        <!-- Signature Section -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Supervisor Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor Name</label>
              <input 
                v-model="form.examinerName" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter supervisor name"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                v-model="form.examinerDate" 
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
          
          <!-- ISEN Overall Mark -->
          <div v-if="assessmentType === 'isen'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Overall Mark</label>
            <input 
              v-model.number="form.overallMark" 
              type="number" 
              min="0" 
              max="100"
              class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Overall mark"
            >
          </div>

          <!-- Materials Development specific fields -->
          <div v-if="assessmentType === 'materials'" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Supervisor Designation</label>
              <input 
                v-model="form.supervisorDesignation" 
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter supervisor designation"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Total Percentage</label>
              <input 
                :value="form.materialsTotalPercentage" 
                type="number" 
                min="0" 
                max="100"
                class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                placeholder="% (auto)"
                readonly
              >
            </div>
          </div>

          <!-- Digital Signature Drawing Area -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Digital Signature</label>
            <div class="border-2 border-gray-300 rounded-lg p-4">
              <canvas 
                ref="signatureCanvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
                class="w-full h-32 border border-gray-200 rounded cursor-crosshair bg-white"
                style="touch-action: none;"
              ></canvas>
              <div class="flex justify-between items-center mt-2">
                <button 
                  type="button"
                  @click="clearSignature"
                  class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                >
                  Clear Signature
                </button>
                <span class="text-xs text-gray-500">Draw your signature above</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Score Display -->
        <div class="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h2 class="text-xl font-semibold text-blue-900 mb-2">Total Score</h2>
          <div class="text-3xl font-bold text-blue-600">{{ totalScore }}/100</div>
          <div class="text-sm text-blue-700 mt-1">Grade: {{ getGrade(totalScore) }}</div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button type="submit" :disabled="loading || !canSubmitAssessment" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ loading ? 'Submitting...' : 'Submit Assessment' }}
          </button>
          <div v-if="!isResearchCategoryValid" class="text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
            <strong>⚠️ Required:</strong> Please select a research category (Community Service, Innovation, or Industrialisation) to enable the Community Service and Remaining Pillars fields. This is required for ECD assessments.
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useOfflineQueue } from '~/composables/useOfflineQueue'
import { useOfflineSync } from '~/composables/useOfflineSync'

definePageMeta({ title: 'Create New Assessment', middleware: 'supervisor-auth' })

const loading = ref(false)
const searching = ref(false)

// Signature drawing functionality
const signatureCanvas = ref(null)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)

// Supervisor model - prefilled from the logged-in supervisor's account
const supervisor = ref({ fullName: '', nationalId: '', phoneNumber: '', email: '' })
const supervisorAutoFilled = ref(false)

// Student search and model
const studentSearch = ref({ srn: '', surname: '' })
const studentsResults = ref([])
const selectedStudentId = ref(null)
const student = ref({ fullName: '', sex: '', candidateNo: '', email: '', schoolName: '', className: '' })

// Settings
const { settings, loadSettings } = useAssessmentSettings()

// Selected assessment type (from query). Default to ecd
const assessmentType = ref('ecd')

// Selected criteria (from query, if provided)
const selectedCriteria = ref([])


// Assessment fields (scores/comments)
const form = ref({
  subject: '',
  topic: '',
  assessmentDate: new Date().toISOString().slice(0, 16),
  assessmentTime: '',
  // ECD & Junior Level fields
  preparationMark: 0,
  preparationComment: '',
  // ECD-specific fields
  lessonFacilitationMark: 0,
  lessonFacilitationComment: '',
  recordsMark: 0,
  recordsComment: '',
  // Junior-specific fields
  lessonPlanningMark: 0,
  lessonPlanningComment: '',
  documentsMark: 0,
  documentsComment: '',
  // Common fields
  introductionMark: 0,
  introductionComment: '',
  developmentMark: 0,
  developmentComment: '',
  conclusionMark: 0,
  conclusionComment: '',
  personalDimensionsMark: 0,
  personalDimensionsComment: '',
  deportmentMark: 0,
  deportmentComment: '',
  environmentMark: 0,
  environmentComment: '',
  communityMark: 0,
  communityComment: '',
          remainingPillarsMark: 0,
          remainingPillarsComment: '',
          remainingPillarsMark2: 0,
          remainingPillarsComment2: '',
          // Research category selection
          selectedResearchCategory: '',
  // Materials Development fields
  contentRelevanceMark: 0,
  contentOrganizationMark: 0,
  contentTotalMark: 0,
  contentRelevanceComment: '',
  contentOrganizationComment: '',
  pedagogicalAlignmentMark: 0,
  pedagogicalEngagementMark: 0,
  pedagogicalConnectionMark: 0,
  pedagogicalInclusiveMark: 0,
  pedagogicalTotalMark: 0,
  pedagogicalAlignmentComment: '',
  pedagogicalEngagementComment: '',
  pedagogicalConnectionComment: '',
  pedagogicalInclusiveComment: '',
  designVisualMark: 0,
  designNavigationMark: 0,
  designQualityMark: 0,
  designConsistencyMark: 0,
  designTotalMark: 0,
  designVisualComment: '',
  designNavigationComment: '',
  designQualityComment: '',
  designConsistencyComment: '',
  innovationOriginalityMark: 0,
  innovationTechnologyMark: 0,
  innovationTotalMark: 0,
  innovationOriginalityComment: '',
  innovationTechnologyComment: '',
  educationLocalMark: 0,
  educationHeritageMark: 0,
  educationProblemMark: 0,
  educationCommercialMark: 0,
  educationTotalMark: 0,
  educationLocalComment: '',
  educationHeritageComment: '',
  educationProblemComment: '',
  educationCommercialComment: '',
  materialsTotalMark: 0,
  // Signature fields
  examinerName: '',
  examinerDate: new Date().toISOString().slice(0, 10),
  overallMark: 0,
  supervisorDesignation: '',
  materialsTotalPercentage: 0,
  signatureData: '',
  overallComment: ''
})

// Clamp helpers to enforce max marks strictly
const clamp = (value, min, max) => {
  const num = Number(value)
  if (Number.isNaN(num)) return min
  if (num < min) return min
  if (num > max) return max
  return Math.round(num)
}

const clampField = (field, max) => {
  form.value[field] = clamp(form.value[field], 0, max)
}

// Deep watch: clamp any time a mark changes (covers paste, wheel, programmatic)
watch(form, () => {
  if (assessmentType.value === 'materials') {
    // Materials Development specific clamping
    clampField('contentRelevanceMark', 10)
    clampField('contentOrganizationMark', 10)
    form.value.contentTotalMark = clamp(
      (Number(form.value.contentRelevanceMark) || 0) +
      (Number(form.value.contentOrganizationMark) || 0),
      0, 20
    )
    clampField('pedagogicalAlignmentMark', 5)
    clampField('pedagogicalEngagementMark', 5)
    clampField('pedagogicalConnectionMark', 5)
    clampField('pedagogicalInclusiveMark', 5)
    form.value.pedagogicalTotalMark = clamp(
      (Number(form.value.pedagogicalAlignmentMark) || 0) +
      (Number(form.value.pedagogicalEngagementMark) || 0) +
      (Number(form.value.pedagogicalConnectionMark) || 0) +
      (Number(form.value.pedagogicalInclusiveMark) || 0),
      0, 20
    )
    clampField('designVisualMark', 5)
    clampField('designNavigationMark', 5)
    clampField('designQualityMark', 5)
    clampField('designConsistencyMark', 5)
    form.value.designTotalMark = clamp(
      (Number(form.value.designVisualMark) || 0) +
      (Number(form.value.designNavigationMark) || 0) +
      (Number(form.value.designQualityMark) || 0) +
      (Number(form.value.designConsistencyMark) || 0),
      0, 20
    )
    clampField('innovationOriginalityMark', 10)
    clampField('innovationTechnologyMark', 10)
    form.value.innovationTotalMark = clamp(
      (Number(form.value.innovationOriginalityMark) || 0) +
      (Number(form.value.innovationTechnologyMark) || 0),
      0, 20
    )
    clampField('educationLocalMark', 5)
    clampField('educationHeritageMark', 5)
    clampField('educationProblemMark', 5)
    clampField('educationCommercialMark', 5)
    form.value.educationTotalMark = clamp(
      (Number(form.value.educationLocalMark) || 0) +
      (Number(form.value.educationHeritageMark) || 0) +
      (Number(form.value.educationProblemMark) || 0) +
      (Number(form.value.educationCommercialMark) || 0),
      0, 20
    )
    form.value.materialsTotalMark = clamp(
      (Number(form.value.contentTotalMark) || 0) +
      (Number(form.value.pedagogicalTotalMark) || 0) +
      (Number(form.value.designTotalMark) || 0) +
      (Number(form.value.innovationTotalMark) || 0) +
      (Number(form.value.educationTotalMark) || 0),
      0, 100
    )
    form.value.materialsTotalPercentage = form.value.materialsTotalMark
  } else if (assessmentType.value === 'junior') {
    // Junior Level specific clamping
    clampField('preparationMark', 15)
    clampField('lessonPlanningMark', 15)
    clampField('deportmentMark', 5)
    clampField('documentsMark', 15)
    clampField('environmentMark', 10)
    clampField('communityMark', 30)
    clampField('remainingPillarsMark', 10)
  } else {
    // ECD, Secondary, ISEN specific clamping
    clampField('preparationMark', 15)
    clampField('lessonFacilitationMark', 15)
    clampField('deportmentMark', 5)
    clampField('recordsMark', 15)
    clampField('environmentMark', 10)
    clampField('communityMark', 30)
    clampField('remainingPillarsMark', 10)
  }
}, { deep: true })

const totalScore = computed(() => {
  if (assessmentType.value === 'ecd') {
    return form.value.preparationMark +
           form.value.lessonFacilitationMark +
           form.value.deportmentMark +
           form.value.recordsMark +
           form.value.environmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'junior') {
    return form.value.preparationMark +
           form.value.lessonPlanningMark +
           form.value.deportmentMark +
           form.value.documentsMark +
           form.value.environmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'secondary') {
    return form.value.preparationMark +
           form.value.recordsMark +
           form.value.lessonFacilitationMark +
           form.value.deportmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'isen') {
    return form.value.preparationMark +
           form.value.recordsMark +
           form.value.lessonFacilitationMark +
           form.value.deportmentMark +
           form.value.environmentMark +
           form.value.communityMark +
           form.value.remainingPillarsMark
  } else if (assessmentType.value === 'materials') {
    return form.value.contentTotalMark +
           form.value.pedagogicalTotalMark +
           form.value.designTotalMark +
           form.value.innovationTotalMark +
           form.value.educationTotalMark
  }
  return 0
})

const getGrade = (score) => {
  if (score >= 80) return '1'
  if (score >= 70) return '2.1'
  if (score >= 60) return '2.2'
  if (score >= 50) return '3'
  return 'F'
}

// Validation for research category selection
const isResearchCategoryValid = computed(() => {
  if (assessmentType.value === 'ecd' || assessmentType.value === 'secondary') {
    return form.value.selectedResearchCategory && form.value.selectedResearchCategory.trim() !== ''
  }
  return true
})

const canSubmitAssessment = computed(() => {
  return isResearchCategoryValid.value && form.value.subject && form.value.topic
})

const searchStudents = async () => {
  searching.value = true
  try {
    const params = new URLSearchParams()
    if (studentSearch.value.srn) {
      const srn = String(studentSearch.value.srn).trim()
      params.set('candidateNo', srn)
    }
    if (studentSearch.value.surname) {
      const surname = String(studentSearch.value.surname).trim()
      params.set('surname', surname)
    }
    
    const res = await $fetch(`/api/students/search?${params.toString()}`)
    studentsResults.value = res.students || []
    
    // Fallback attempt: strip non-alphanumerics if nothing returned
    if ((!studentsResults.value || !studentsResults.value.length) && studentSearch.value.srn) {
      const fallback = String(studentSearch.value.srn).replace(/[^a-zA-Z0-9]/g, '')
      if (fallback) {
        const res2 = await $fetch(`/api/students/search?candidateNo=${encodeURIComponent(fallback)}`)
        studentsResults.value = res2.students || []
      }
    }
  } catch (e) {
    console.error('Search failed', e)
    alert(`Student search failed: ${e.message || 'Unknown error'}`)
  } finally {
    searching.value = false
  }
}

const selectStudent = (s) => {
  selectedStudentId.value = s.id
  student.value = { 
    fullName: s.fullName,
    sex: s.sex,
    candidateNo: s.candidateNo,
    email: s.email,
    schoolName: s.schoolName,
    className: s.className
  }
}

// Assessment form submission

const ensureSupervisor = async () => {
  // Fetch the currently logged-in supervisor; creation is not permitted here
  try {
    const me = await $fetch('/api/supervisors/me')
    if (me?.supervisor?.id) return me.supervisor.id

    // As a fallback for older APIs, attempt filtered lookup allowed for non-admin roles
    const email = supervisor.value.email?.toLowerCase() || ''
    const nationalId = supervisor.value.nationalId || ''
    if (email || nationalId) {
      const existing = await $fetch(`/api/supervisors?${new URLSearchParams({ email, nationalId }).toString()}`)
      const found = (existing.supervisors || [])[0]
      if (found?.id) return found.id
    }

    throw new Error('Supervisor session missing. Please log in again.')
  } catch (e) {
    console.error('Ensure supervisor failed', e)
    throw e
  }
}

const ensureStudent = async () => {
  // if selected from search, reuse id; else find by candidateNo, else create
  if (selectedStudentId.value) return selectedStudentId.value
  try {
    const res = await $fetch(`/api/students/search?candidateNo=${encodeURIComponent(student.value.candidateNo || '')}`)
    const found = (res.students || [])[0]
    if (found) return found.id
    const created = await $fetch('/api/students', { method: 'POST', body: student.value })
    return created.student.id
  } catch (e) {
    console.error('Ensure student failed', e)
    throw e
  }
}

const submitAssessment = async () => {
  loading.value = true
  try {
    // validate required parts
    if (!supervisor.value.fullName || !supervisor.value.nationalId || !supervisor.value.phoneNumber || !supervisor.value.email) {
      alert('Please complete supervisor registration')
      loading.value = false
      return
    }
    if (!student.value.fullName || !student.value.candidateNo || !student.value.schoolName || !student.value.className || !student.value.sex) {
      alert('Please complete student details')
      loading.value = false
      return
    }
    if (!form.value.subject || !form.value.topic) {
      alert('Please fill in Subject and Topic')
      loading.value = false
      return
    }

    // Final clamp before submit to guarantee marks never exceed maxima
    if (assessmentType.value === 'materials') {
      // Materials Development specific clamping
      clampField('contentRelevanceMark', 10)
      clampField('contentOrganizationMark', 10)
      clampField('contentTotalMark', 20)
      clampField('pedagogicalAlignmentMark', 5)
      clampField('pedagogicalEngagementMark', 5)
      clampField('pedagogicalConnectionMark', 5)
      clampField('pedagogicalInclusiveMark', 5)
      clampField('pedagogicalTotalMark', 20)
      clampField('designVisualMark', 5)
      clampField('designNavigationMark', 5)
      clampField('designQualityMark', 5)
      clampField('designConsistencyMark', 5)
      clampField('designTotalMark', 20)
      clampField('innovationOriginalityMark', 10)
      clampField('innovationTechnologyMark', 10)
      clampField('innovationTotalMark', 20)
      clampField('educationLocalMark', 5)
      clampField('educationHeritageMark', 5)
      clampField('educationProblemMark', 5)
      clampField('educationCommercialMark', 5)
      clampField('educationTotalMark', 20)
      clampField('materialsTotalMark', 100)
            } else if (assessmentType.value === 'junior') {
              // Junior specific clamping
              clampField('preparationMark', 15)
              clampField('lessonPlanningMark', 15)
              clampField('deportmentMark', 5)
              clampField('documentsMark', 15)
              clampField('environmentMark', 10)
              clampField('communityMark', 30)
              clampField('remainingPillarsMark', 10)
    } else {
      // ECD, Secondary, ISEN specific clamping
      clampField('preparationMark', 15)
      clampField('lessonFacilitationMark', 15)
      clampField('deportmentMark', 5)
      clampField('recordsMark', 15)
      clampField('environmentMark', 10)
      clampField('communityMark', 30)
      clampField('remainingPillarsMark', 10)
    }

    // Get signature data
    const signatureData = getSignatureData()

    // Prepare form data based on assessment type
    let formData = { ...form.value }

    // For ECD assessments, only send ECD-specific fields
    if (assessmentType.value === 'ecd') {
      formData = {
        ...formData,
        // Remove Junior-specific fields for ECD
        lessonPlanningMark: undefined,
        lessonPlanningComment: undefined,
        documentsMark: undefined,
        documentsComment: undefined
      }
    }
    // For Junior assessments, only send Junior-specific fields
    else if (assessmentType.value === 'junior') {
      formData = {
        ...formData,
        // Remove ECD-specific fields for Junior
        lessonFacilitationMark: undefined,
        lessonFacilitationComment: undefined,
        recordsMark: undefined,
        recordsComment: undefined
      }
    }

    const clientUuid = crypto.randomUUID()

    // If we're offline, skip the network round-trips entirely and queue the
    // whole submission for later sync (mirrors the online form/flow).
    if (!navigator.onLine) {
      await queueAssessment({ formData, signatureData, clientUuid })
      return
    }

    let supervisorId, studentId
    try {
      supervisorId = await ensureSupervisor()
      studentId = await ensureStudent()
    } catch (e) {
      // Network calls failed even though navigator.onLine is true (flaky
      // connection) - fall back to the offline queue rather than losing data.
      await queueAssessment({ formData, signatureData, clientUuid })
      return
    }

    try {
      await $fetch('/api/assessments', {
        method: 'POST',
        body: {
          ...formData,
          studentId,
          formType: assessmentType.value,
          signatureData: signatureData,
          clientUuid
        }
      })
    } catch (e) {
      await queueAssessment({ formData, signatureData, clientUuid })
      return
    }

    alert('Assessment created successfully!')
    await navigateTo('/supervisor')
  } catch (error) {
    console.error('Error creating assessment:', error)
    alert('Failed to create assessment. Please try again.')
  } finally {
    loading.value = false
  }
}

// Save the submission locally (IndexedDB) so it can be synced automatically
// once the device is back online. Re-uses supervisor/student details already
// captured on this form.
const queueAssessment = async ({ formData, signatureData, clientUuid }) => {
  const { addToQueue } = useOfflineQueue()
  const { refreshPendingCount, syncQueue } = useOfflineSync()

  await addToQueue({
    clientUuid,
    assessmentType: assessmentType.value,
    supervisor: { ...supervisor.value },
    student: { ...student.value },
    selectedStudentId: selectedStudentId.value,
    formData,
    signatureData
  })
  await refreshPendingCount()

  alert('You appear to be offline. The assessment has been saved on this device and will be submitted automatically once you are back online.')
  await navigateTo('/supervisor')

  // In case connectivity returns immediately after navigation
  syncQueue()
}

// Signature drawing methods
const startDrawing = (e) => {
  isDrawing.value = true
  const canvas = signatureCanvas.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
  
  lastX.value = (clientX - rect.left) * scaleX
  lastY.value = (clientY - rect.top) * scaleY
}

const draw = (e) => {
  if (!isDrawing.value) return
  
  const canvas = signatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
  
  const currentX = (clientX - rect.left) * scaleX
  const currentY = (clientY - rect.top) * scaleY
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(currentX, currentY)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.stroke()
  
  lastX.value = currentX
  lastY.value = currentY
}

const stopDrawing = () => {
  isDrawing.value = false
}

const clearSignature = () => {
  const canvas = signatureCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const getSignatureData = () => {
  const canvas = signatureCanvas.value
  if (!canvas) return null
  
  return canvas.toDataURL('image/png')
}



// Calculate Junior Level total score
const calculateJuniorTotal = () => {
  if (assessmentType.value === 'junior') {
    // Clamp values to their maximums
    form.value.preparationMark = Math.min(Math.max(form.value.preparationMark || 0, 0), 15)
    form.value.lessonPlanningMark = Math.min(Math.max(form.value.lessonPlanningMark || 0, 0), 15)
    form.value.deportmentMark = Math.min(Math.max(form.value.deportmentMark || 0, 0), 5)
    form.value.documentsMark = Math.min(Math.max(form.value.documentsMark || 0, 0), 15)
    form.value.environmentMark = Math.min(Math.max(form.value.environmentMark || 0, 0), 10)
    form.value.communityMark = Math.min(Math.max(form.value.communityMark || 0, 0), 30)
    form.value.remainingPillarsMark = Math.min(Math.max(form.value.remainingPillarsMark || 0, 0), 10)
  }
}


onMounted(() => {
  loadSettings()
  const route = useRoute()
  const q = String(route.query.type || '').toLowerCase()
  if (q === 'ecd' || q === 'secondary' || q === 'isen' || q === 'materials') {
    assessmentType.value = q
  }

  // Prefill supervisor details from the logged-in account so they don't have
  // to be retyped on every assessment
  $fetch('/api/supervisors/me').then((me) => {
    if (me?.supervisor) {
      supervisor.value = {
        fullName: me.supervisor.fullName || '',
        nationalId: me.supervisor.nationalId || '',
        phoneNumber: me.supervisor.phoneNumber || '',
        email: me.supervisor.email || ''
      }
      supervisorAutoFilled.value = true
    }
  }).catch(() => {
    // Offline or session lookup failed - leave fields editable as a fallback
  })


  // Initialize signature canvas
  nextTick(() => {
    const canvas = signatureCanvas.value
    if (canvas) {
      const ctx = canvas.getContext('2d')
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  })
})
</script> 