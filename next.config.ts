import type { NextConfig } from 'next';

// ── Content Security Policy ────────────────────────────────────────────────
// Tightly scoped to the actual external origins used by this app.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:
    https://ik.imagekit.io
    https://picsum.photos
    https://*.supabase.co
    https://*.openfreemap.org
    https://basemaps.cartocdn.com;
  connect-src 'self'
    https://*.supabase.co
    https://tiles.openfreemap.org
    https://basemaps.cartocdn.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\n\s+/g, ' ').trim();

// ── Security headers applied to every route ───────────────────────────────
const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Block iframe embedding (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Limit referrer leakage
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Force HTTPS for 2 years, include subdomains
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Disable unused browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), payment=(), usb=()',
  },
  // CSP
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // Remove X-Powered-By: Next.js fingerprint
  poweredByHeader: false,

  // Allow cross-origin requests from local network during dev
  allowedDevOrigins: ['192.168.254.164', '192.168.56.1'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
