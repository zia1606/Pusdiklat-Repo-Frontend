<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar :show="showSidebar" @close="showSidebar = false" @toggle="toggleSidebar" />

      <!-- Main content -->
      <div class="flex-1 overflow-y-auto pt-16">
        <div class="p-10">
          <div class="max-w-4xl mx-auto">
            <!-- Top Action Bar -->
            <div class="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Tentang Kami</h2>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Pengaturan Informasi Aplikasi</p>
              </div>
            </div>

            <!-- Form Container -->
            <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden p-8">
              <form @submit.prevent="updateSettings" class="space-y-6">
                
                <div class="space-y-2">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                  <textarea 
                    v-model="form.alamat" 
                    rows="3"
                    class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    placeholder="Masukkan alamat..."
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jam Operasional (Senin-Kamis)</label>
                    <input 
                      v-model="form.jam_operasional_senin_kamis" 
                      type="text" 
                      class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    >
                  </div>
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jam Operasional (Jumat)</label>
                    <input 
                      v-model="form.jam_operasional_jumat" 
                      type="text" 
                      class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      v-model="form.email" 
                      type="email" 
                      class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    >
                  </div>
                  <div class="space-y-2">
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telepon</label>
                    <input 
                      v-model="form.telepon" 
                      type="text" 
                      class="block w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 font-medium"
                    >
                  </div>
                </div>

                <div class="flex justify-end pt-6">
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="px-8 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                  >
                    <span v-if="!isSubmitting">Simpan Pengaturan</span>
                    <span v-else>Menyimpan...</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUnifiedAuthStore } from '~/stores/unifiedAuth';
import { definePageMeta, navigateTo } from '#imports';
import { $fetch } from 'ofetch';
import Sidebar from '~/components/Admin/Sidebar.vue';
import { useToast } from '~/composables/useToast';

const { public: { apiBaseUrl } } = useRuntimeConfig();
const { showToast } = useToast();
const authStore = useUnifiedAuthStore();

definePageMeta({
  middleware: 'admin'
});

useHead({
  title: 'Manajemen Tentang Kami - Sistem Repositori'
});

const showSidebar = ref(false);
const isSubmitting = ref(false);

const form = ref({
  alamat: '',
  jam_operasional_senin_kamis: '',
  jam_operasional_jumat: '',
  email: '',
  telepon: ''
});

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const fetchSettings = async () => {
  try {
    const response = await $fetch(`${apiBaseUrl}/api/settings`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.data) {
      form.value = {
        alamat: response.data.alamat || '',
        jam_operasional_senin_kamis: response.data.jam_operasional_senin_kamis || '',
        jam_operasional_jumat: response.data.jam_operasional_jumat || '',
        email: response.data.email || '',
        telepon: response.data.telepon || ''
      };
    }
  } catch (error) {
    showToast('error', 'Gagal memuat pengaturan');
  }
};

const updateSettings = async () => {
  isSubmitting.value = true;
  try {
    await $fetch(`${apiBaseUrl}/api/settings`, {
      method: 'PUT',
      body: { settings: form.value },
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });
    showToast('success', 'Pengaturan berhasil disimpan');
  } catch (error) {
    showToast('error', 'Gagal menyimpan pengaturan');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>
