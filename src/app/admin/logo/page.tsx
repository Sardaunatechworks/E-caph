'use client';

import { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Logo } from '@/components/common/logo';
import { createClient } from '@/lib/supabase/client';
import { Upload, Image as ImageIcon, RotateCcw, Check, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export interface LogoConfig {
  use_custom_image: boolean;
  image_url: string;
  brand_title: string;
  registration_number: string;
  updated_at: string;
}

const defaultLogoConfig: LogoConfig = {
  use_custom_image: false,
  image_url: '/logo.png',
  brand_title: 'e-CAPH',
  registration_number: 'RC:144280',
  updated_at: new Date().toISOString(),
};

export default function AdminLogoPage() {
  const [config, setConfig] = useState<LogoConfig>(defaultLogoConfig);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLogoConfig = async () => {
    setLoading(true);
    let current = defaultLogoConfig;

    // 1. Read from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecaph_site_logo');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            current = { ...defaultLogoConfig, ...parsed };
          }
        } catch {}
      }
    }

    // 2. Read from Supabase site_settings
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'site_logo');

      if (!error && data && data[0]?.value) {
        current = { ...defaultLogoConfig, ...data[0].value };
      }
    } catch {}

    setConfig(current);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogoConfig();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result as string;
        setConfig((prev) => ({
          ...prev,
          image_url: base64Url,
          use_custom_image: true,
        }));

        // Attempt Supabase storage upload
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop();
          const fileName = `site_logo_${Date.now()}.${fileExt}`;
          const filePath = `branding/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('media')
              .getPublicUrl(filePath);
            if (publicUrlData?.publicUrl) {
              setConfig((prev) => ({
                ...prev,
                image_url: publicUrlData.publicUrl,
                use_custom_image: true,
              }));
            }
          }
        } catch {}
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Logo upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: LogoConfig = {
      ...config,
      updated_at: new Date().toISOString(),
    };

    // Save to localStorage & dispatch event
    if (typeof window !== 'undefined') {
      localStorage.setItem('ecaph_site_logo', JSON.stringify(updatedConfig));
      window.dispatchEvent(new Event('ecaph_logo_updated'));
    }

    // Save to Supabase site_settings (if table exists)
    try {
      const supabase = createClient();
      await supabase.from('site_settings').upsert(
        { key: 'site_logo', value: updatedConfig, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      ).then(({ error }) => {
        if (error) {
          // Table site_settings pending creation in Supabase SQL Editor
        }
      });
    } catch {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    if (confirm('Are you sure you want to reset the website logo back to the official default logo?')) {
      const resetConfig = { ...defaultLogoConfig };
      setConfig(resetConfig);

      if (typeof window !== 'undefined') {
        localStorage.setItem('ecaph_site_logo', JSON.stringify(resetConfig));
        window.dispatchEvent(new Event('ecaph_logo_updated'));
      }

      try {
        const supabase = createClient();
        supabase.from('site_settings').upsert(
          { key: 'site_logo', value: resetConfig, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        ).then(() => {});
      } catch {}

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7FAF8] font-sans">
      <AdminHeader title="Logo &amp; Brand Identity CMS" />

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Success Alert */}
        {savedSuccess && (
          <div className="p-4 rounded-[10px] bg-[#F3F9E9] border border-[#86C127]/40 text-[#6EA71F] flex items-center justify-between font-semibold text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#86C127]" />
              <span>Website Logo &amp; Branding updated successfully across the system!</span>
            </div>
          </div>
        )}

        {/* Live Preview Card */}
        <div className="p-8 rounded-[12px] bg-white border border-[#E2E8F0] brand-shadow space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0092DF]">Live Website Logo Preview</h2>
              <p className="text-xs text-[#64748B]">Real-time preview of how your logo appears on header &amp; footer elements.</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#86C127] bg-[#F3F9E9] px-2.5 py-1 rounded-full">
              System Branding
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header Light Preview */}
            <div className="p-6 rounded-[10px] bg-white border border-[#E2E8F0] space-y-3">
              <span className="text-[10px] font-bold uppercase text-[#94A3B8] block">On White Header Background</span>
              <div className="p-4 bg-[#F8FAFC] rounded-[8px] border border-slate-200 flex items-center justify-center">
                <Logo key={`light-${config.image_url}-${config.use_custom_image}`} />
              </div>
            </div>

            {/* Footer Dark Preview */}
            <div className="p-6 rounded-[10px] bg-[#003D60] border border-[#003D60] text-white space-y-3">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">On Dark Footer Background</span>
              <div className="p-4 bg-[#002D48] rounded-[8px] border border-[#004A75] flex items-center justify-center">
                <Logo key={`dark-${config.image_url}-${config.use_custom_image}`} variant="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Logo Management Form */}
        <form onSubmit={handleSave} className="p-8 rounded-[12px] bg-white border border-[#E2E8F0] brand-shadow space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0092DF]">Logo Settings &amp; Custom Image Upload</h3>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetDefault}
              className="text-xs border-[#E2E8F0] font-bold text-[#E67817] hover:bg-[#FFF8F2]"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset to Official Default
            </Button>
          </div>

          {/* Logo Mark Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1E293B]">Logo Display Mode</label>
            <Select
              value={config.use_custom_image ? 'custom' : 'vector'}
              onChange={(e) => setConfig({ ...config, use_custom_image: e.target.value === 'custom' })}
              className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
            >
              <option value="vector">Official e-CAPH Vector Mark (Recommended)</option>
              <option value="custom">Uploaded Custom Image File</option>
            </Select>
          </div>

          {/* Custom Image File Upload */}
          <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
            <label className="text-xs font-bold text-[#1E293B]">Upload Custom Logo Image File</label>

            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-[10px] border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                {config.image_url ? (
                  <img src={config.image_url} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <label
                  htmlFor="logo_image_input"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-[#0092DF] text-white text-xs font-bold hover:bg-[#007DC2] cursor-pointer shadow-sm transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Upload className="w-4 h-4 text-white" />
                  )}
                  Select Image File from Computer
                </label>
                <input
                  id="logo_image_input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[11px] text-[#64748B]">Supports transparent PNG, SVG, JPG, WebP images from your device.</p>
              </div>
            </div>
          </div>

          {/* Brand Text Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E2E8F0]">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Brand Title Text </label>
              <Input
                value={config.brand_title}
                onChange={(e) => setConfig({ ...config, brand_title: e.target.value })}
                placeholder="e-CAPH"
                
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1E293B]">Registration Number (RC) </label>
              <Input
                value={config.registration_number}
                onChange={(e) => setConfig({ ...config, registration_number: e.target.value })}
                placeholder="RC:144280"
              
                className="bg-white border-[#E2E8F0] h-10 text-xs rounded-[6px]"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
            <Button type="submit" className="bg-[#0092DF] hover:bg-[#007DC2] text-white font-bold px-6">
              Save &amp; Update Logo Across Website
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
