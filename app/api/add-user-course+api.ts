const TOKEN = process.env.STRAPI_API_ADMIN_TOKEN;

export async function POST(request: Request) {
  try {
    const { courseId, clerkId } = await request.json();

    const body = {
      data: {
        course: courseId,
        clerkId: clerkId,
      },
    };

    const response = await fetch(`${process.env.EXPO_PUBLIC_STRAPI_API_URL}/api/user-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return Response.json(result.data);
  } catch (error) {
    throw error;
  }
}
