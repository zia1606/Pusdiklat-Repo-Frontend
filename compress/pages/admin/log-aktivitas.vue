<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="flex h-screen">
      <Sidebar :show="showSidebar" @close="showSidebar = false" @toggle="toggleSidebar" />
      <div class="flex-1 overflow-y-auto pt-16">
        <div class="p-10">
          <div class="max-w-7xl mx-auto">
            <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Log Aktivitas</h2>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Pemantauan Sistem & Pengguna Terpadu</p>
              </div>

              <!-- Filter Bar -->
              <div class="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div class="relative">
                  <select v-model="filters.category" @change="handleFilterChange" class="pl-4 pr-10 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-600 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer">
                    <option value="">Semua Kategori</option>
                    <option value="Login">Log Sistem</option>
                    <option value="Buku Tamu">Buku Tamu</option>
                    <option value="Riwayat Baca">Riwayat Baca</option>
                    <option value="Favorit">Favorit</option>
                  </select>
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <div class="relative flex-1 min-w-[200px]">
                  <input v-model="filters.search" @input="debounceSearch" type="text" placeholder="CARI PENGGUNA ATAU AKTIVITAS..." class="w-full pl-10 pr-4 py-2.5 text-xs font-bold uppercase tracking-widest bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 placeholder:text-gray-300">
                  <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loader -->
            <div v-if="isLoading" class="flex justify-center items-center py-20">
              <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>

            <!-- Unified Table -->
            <div v-else class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <table class="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr class="bg-gray-50/50 border-b border-gray-50">
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-16">No</th>
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pengguna</th>
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aktivitas</th>
                    <th class="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Waktu</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(log, index) in logs" :key="log.id" class="hover:bg-blue-50/30 transition-all">
                    <td class="py-5 px-6 text-sm font-bold text-gray-600">{{ calculateIndex(index) }}</td>
                    <td class="py-5 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">
                          {{ (log.user?.name || 'U').charAt(0).toUpperCase() }}
                        </div>
                        <div>
                          <div class="text-sm font-bold text-gray-900">{{ log.user?.name || 'Unknown' }}</div>
                          <div class="text-[10px] text-gray-400 font-medium">{{ log.user?.email || 'Guest' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-5 px-6">
                      <span :class="getCategoryClass(log.category)" class="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg">
                        {{ log.category }}
                      </span>
                    </td>
                    <td class="py-5 px-6">
                      <div class="text-sm font-medium text-gray-800">{{ log.description }}</div>
                      <div v-if="log.action === 'Login'" class="text-[10px] text-gray-400 mt-0.5 font-mono">
                        IP: {{ log.ip_address }}
                      </div>
                    </td>
                    <td class="py-5 px-6">
                      <div class="text-sm text-gray-600 font-medium">{{ formatDate(log.created_at) }}</div>
                      <div class="text-[10px] text-gray-400">{{ formatTime(log.created_at) }}</div>
                    </td>
                  </tr>
                  <tr v-if="logs.length === 0">
                    <td colspan="5" class="py-20 text-center">
                      <div class="text-gray-300 mb-2">
                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                      </div>
                      <span class="text-xs uppercase tracking-[0.2em] font-black text-gray-400">Tidak ada aktivitas ditemukan</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div v-if="pagination.total > pagination.per_page" class="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Showing {{ pagination.from }}-{{ pagination.to }} of {{ pagination.total }}
                </span>
                <div class="flex gap-2">
                  <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all">Prev</button>
                  <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-all">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { definePageMeta } from '#imports';
import { $fetch } from 'ofetch';
import Sidebar from '~/components/Admin/Sidebar.vue';
import { useToast } from '~/composables/useToast';

const { public: { apiBaseUrl } } = useRuntimeConfig();
const { showToast } = useToast();
const authStore = useUnifiedAuthStore();

definePageMeta({ middleware: 'admin' });
useHead({ title: 'Log Aktivitas - Sistem Repositori' });

const showSidebar = ref(false);
const isLoading = ref(false);
const logs = ref([]);
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0,
  per_page: 15,
  from: 0,
  to: 0
});

const filters = reactive({
  category: '',
  search: ''
});

let searchTimeout = null;

const toggleSidebar = () => showSidebar.value = !showSidebar.value;

const getCategoryClass = (category) => {
  const map = {
    'Login': 'bg-blue-100 text-blue-600',
    'Buku Tamu': 'bg-purple-100 text-purple-600',
    'Riwayat Baca': 'bg-amber-100 text-amber-600',
    'Favorit': 'bg-rose-100 text-rose-600',
    'Sistem': 'bg-gray-100 text-gray-600'
  };
  return map[category] || 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateIndex = (index) => {
  return (pagination.current_page - 1) * pagination.per_page + index + 1;
};

const fetchData = async (page = 1) => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      page: page,
      category: filters.category,
      search: filters.search
    });

    const response = await $fetch(`${apiBaseUrl}/api/logs?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });

    if (response.status) {
      logs.value = response.data.data;
      pagination.current_page = response.data.current_page;
      pagination.last_page = response.data.last_page;
      pagination.total = response.data.total;
      pagination.per_page = response.data.per_page;
      pagination.from = response.data.from;
      pagination.to = response.data.to;
    }
  } catch (error) {
    showToast('error', 'Gagal memuat log aktivitas');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleFilterChange = () => {
  pagination.current_page = 1;
  fetchData();
};

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleFilterChange();
  }, 500);
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.last_page) {
    fetchData(page);
  }
};

onMounted(() => {
  fetchData();
});
</script>
