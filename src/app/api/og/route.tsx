import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '72px', color: '#3B82F6', fontFamily: 'monospace' }}>
            {'{}'}
          </span>
          <span style={{ fontSize: '56px', fontWeight: 700, color: '#E2E8F0' }}>
            JSON Prettify
          </span>
        </div>
        <p style={{ fontSize: '28px', color: '#94A3B8', textAlign: 'center', maxWidth: '800px' }}>
          Format, Validate &amp; Transform JSON Instantly
        </p>
        <p style={{ fontSize: '20px', color: '#64748B', marginTop: '12px' }}>
          Fast. Private. Client-side only.
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
