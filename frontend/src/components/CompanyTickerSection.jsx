import React from 'react';

// Brand SVG Logos
const BrandLogos = {
  Google: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  ),
  Slack: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path d="M6 15a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#E01E5A" />
      <path d="M6 13.5a2.5 2.5 0 012.5-2.5h5a2.5 2.5 0 110 5h-5A2.5 2.5 0 016 13.5z" fill="#E01E5A" />
      <path d="M9 6a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z" fill="#36C5F0" />
      <path d="M10.5 6a2.5 2.5 0 012.5 2.5v5a2.5 2.5 0 11-5 0v-5A2.5 2.5 0 0110.5 6z" fill="#36C5F0" />
      <path d="M18 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" fill="#2EB67D" />
      <path d="M18 10.5a2.5 2.5 0 01-2.5 2.5h-5a2.5 2.5 0 110-5h5a2.5 2.5 0 012.5 2.5z" fill="#2EB67D" />
      <path d="M15 18a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" fill="#ECB22E" />
      <path d="M13.5 18a2.5 2.5 0 01-2.5-2.5v-5a2.5 2.5 0 115 0v5a2.5 2.5 0 01-2.5 2.5z" fill="#ECB22E" />
    </svg>
  ),
  Spotify: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.302c-.22.36-.688.477-1.047.257-2.873-1.756-6.49-2.153-10.75-1.18-.407.094-.814-.162-.907-.57-.094-.407.162-.814.57-.907 4.662-1.066 8.657-.614 11.877 1.353.36.22.477.688.257 1.047zm1.464-3.256c-.277.45-.867.595-1.317.318-3.287-2.02-8.3-2.61-12.19-1.428-.5.152-1.025-.13-1.177-.63-.152-.5.13-1.025.63-1.177 4.45-1.35 9.98-.7 13.736 1.61.45.277.595.867.318 1.317zm.125-3.39c-3.94-2.34-10.435-2.556-14.213-1.408-.61.185-1.25-.166-1.435-.776-.185-.61.166-1.25.776-1.435 4.337-1.316 11.523-1.06 16.064 1.632.55.326.732 1.037.406 1.587-.326.55-1.037.732-1.587.406z"/>
    </svg>
  ),
  Amazon: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF9900">
      <path d="M13.62 13.43c-.93.57-2.22.86-3.39.86-2.63 0-3.64-1.37-3.64-2.88 0-2.48 2.27-3.32 5.09-3.32.61 0 1.25.04 1.83.11v-.39c0-1.04-.6-1.74-2.03-1.74-1.11 0-2.21.36-2.97.86l-.58-1.08c1.04-.72 2.47-1.08 4.02-1.08 2.5 0 3.82 1.25 3.82 3.39v4.54c0 1.25.07 2.12.33 2.66h-1.44c-.2-.36-.26-.89-.26-1.31zm-.11-4.06c-.46-.07-1.01-.11-1.54-.11-1.78 0-3.23.47-3.23 2.05 0 1.01.62 1.62 1.84 1.62 1.04 0 2.08-.43 2.68-1.29v-2.27z"/>
      <path d="M21.14 18.06C16.89 21.2 10.96 22 5.75 19.98c-.73-.28-1.43-.63-2.08-1.03l-.47.62c.72.44 1.49.82 2.3 1.13C11.23 22.82 17.7 21.94 22 18.52l-.86-.46z"/>
    </svg>
  ),
  Figma: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      <path fill="#F24E1E" d="M12 12A4 4 0 1112 4h4v8h-4z"/>
      <path fill="#FF7262" d="M8 8a4 4 0 110-8h4v8H8z"/>
      <path fill="#F24E1E" d="M8 12a4 4 0 00-4 4 4 4 0 004 4h4v-8H8z"/>
      <path fill="#1ABCFE" d="M12 12a4 4 0 104 4 4 4 0 00-4-4z"/>
      <path fill="#0ACF83" d="M8 16a4 4 0 100 8 4 4 0 004-4v-4H8z"/>
    </svg>
  ),
  Netflix: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#E50914">
      <path d="M5.398 0v24h3.996V11.583L14.6 24h4.002V0h-3.996v12.417L9.4 0H5.398z"/>
    </svg>
  ),
  Meta: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0668E1">
      <path d="M16.745 3c-2.4 0-4.498 1.402-5.745 3.398C9.753 4.402 7.655 3 5.255 3 2.355 3 0 5.355 0 8.255c0 4.965 7.42 10.875 11 12.745 3.58-1.87 11-7.78 11-12.745C22 5.355 19.645 3 16.745 3z"/>
    </svg>
  ),
  Microsoft: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z"/>
      <path fill="#7FBA00" d="M13 1h10v10H13z"/>
      <path fill="#00A4EF" d="M1 13h10v10H1z"/>
      <path fill="#FFB900" d="M13 13h10v10H13z"/>
    </svg>
  ),
  Pinterest: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#E60023">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  ),
  Oracle: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#F80000">
      <path d="M16.05 4H7.95C3.56 4 0 7.56 0 11.95v.1C0 16.44 3.56 20 7.95 20h8.1c4.39 0 7.95-3.56 7.95-7.95v-.1C24 7.56 20.44 4 16.05 4zm-8.1 12.3c-2.4 0-4.35-1.95-4.35-4.35s1.95-4.35 4.35-4.35h8.1c2.4 0 4.35 1.95 4.35 4.35s-1.95 4.35-4.35 4.35h-8.1z"/>
    </svg>
  ),
  Walmart: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0071CE">
      <path d="M12 0l2.5 7.5H22l-6 4.5 2.5 7.5-6.5-4.5L5.5 19.5 8 12l-6-4.5h7.5z"/>
    </svg>
  )
};

const COMPANIES = [
  { name: 'Google', component: BrandLogos.Google },
  { name: 'Slack', component: BrandLogos.Slack },
  { name: 'Spotify', component: BrandLogos.Spotify },
  { name: 'Amazon', component: BrandLogos.Amazon },
  { name: 'Figma', component: BrandLogos.Figma },
  { name: 'Netflix', component: BrandLogos.Netflix },
  { name: 'Meta', component: BrandLogos.Meta },
  { name: 'Microsoft', component: BrandLogos.Microsoft },
  { name: 'Pinterest', component: BrandLogos.Pinterest },
  { name: 'Oracle', component: BrandLogos.Oracle },
  { name: 'Walmart', component: BrandLogos.Walmart },
];

export default function CompanyTickerSection() {
  return (
    <section className="bg-[#18181c] py-12 border-b border-gray-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Trusted By <span className="text-yellow-400">1000+</span> Top Tech Companies
        </h3>
      </div>

      {/* Ticker Container */}
      <div className="marquee-container py-4">
        <div className="marquee-content">
          {[...COMPANIES, ...COMPANIES].map((company, index) => {
            const LogoComponent = company.component;
            return (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#222228] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 whitespace-nowrap group cursor-pointer shadow-lg"
              >
                <div className="p-1.5 rounded-lg bg-[#18181c] group-hover:scale-110 transition-transform">
                  <LogoComponent />
                </div>
                <span className="text-base font-bold text-gray-200 group-hover:text-yellow-400 transition-colors">
                  {company.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
