import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[70vh] p-8">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-12 shadow-2xl">
          <div class="flex items-center gap-4 mb-8">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-black text-white uppercase tracking-tight">Admin Dashboard</h1>
              <p class="text-gray-400 text-sm">Welcome back to the luxury management hub.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <h3 class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Sales</h3>
              <p class="text-2xl font-bold text-white">$124,500</p>
              <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-amber-500 w-[70%]"></div>
              </div>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <h3 class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Active Users</h3>
              <p class="text-2xl font-bold text-white">1,240</p>
              <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-pink-500 w-[85%]"></div>
              </div>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <h3 class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Pending Orders</h3>
              <p class="text-2xl font-bold text-white">42</p>
              <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-orange-500 w-[30%]"></div>
              </div>
            </div>
          </div>
          
          <div class="mt-12 p-8 border border-white/5 bg-white/2 rounded-2xl text-center">
            <p class="text-gray-500 text-sm italic">"Luxury is in each detail." – more management features coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboard {}
