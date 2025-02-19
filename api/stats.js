export default async (req, res) => {
  try {
    const response = await fetch(
      `https://umami.xn--5brr03o.top/api/websites/9d107a47-e0d9-4c91-a113-dd69c3983b48/stats`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.ADMIN_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
}
