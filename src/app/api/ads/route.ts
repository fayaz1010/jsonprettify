export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')

  // Ads endpoint works without auth (free users may not be logged in)
  // but checks subscription status if auth is provided
  const isAuthenticated = authHeader && authHeader.startsWith('Bearer ')

  if (isAuthenticated) {
    // Mock: check if user is a Pro subscriber (ad-free)
    const mockUserPlan = 'free' as string

    if (mockUserPlan === 'pro') {
      return Response.json({
        success: true,
        showAds: false,
        reason: 'Pro subscription — ad-free experience',
      })
    }
  }

  return Response.json({
    success: true,
    showAds: true,
    ads: [
      {
        adUnitId: 'mock-ad-unit-banner-top',
        type: 'banner',
        position: 'top',
      },
      {
        adUnitId: 'mock-ad-unit-sidebar',
        type: 'sidebar',
        position: 'right',
      },
    ],
  })
}
