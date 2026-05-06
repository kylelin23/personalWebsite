
import { NextRequest, NextResponse } from 'next/server'
import connectDB from "@/src/database/db"
import blogSchema from "@/src/database/blogSchema"

/* IParams is a TypeScript type definition that describes the structure of the second
   argument that Next.js passes to our API route handler.

   Without IParams:
   - TypeScript wouldn't know what properties the second argument contains
   - We'd lose autocomplete and type checking
   - Typos like { slug } vs { slg } wouldn't be caught until runtime

   With IParams:
   - TypeScript knows the second argument has a "params" object
   - TypeScript knows "params" contains a "slug" property that's a string
   - We get autocomplete when typing { params } and { slug }
   - TypeScript catches errors if we try to access non-existent properties

   Note: IParams doesn't control what Next.js creates - it just tells TypeScript
   what to expect. The actual object structure is determined by our file path:
   /api/blog/[slug]/route.ts creates { params: { slug: "actual-slug-value" } }
*/
type IParams = {
		params: {
			slug: string
		}
}

/*
	The function below and the functions you create inside route.ts files are called
	"API route handlers"

	Next.js automatically passes two arguments to API route handlers:
		1. First argument: NextRequest - The incoming HTTP request object
		2. Second argument: NextJS Object - Contains route information and other metadata
				There is ALWAYS a "params" object here but the object within is based on our
				api path naming which in this case is "slug"
	We need to include req, even though we don't use it here, so that we can access
	the second argument
*/
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }){
	const { slug } = await params;

	await connectDB();

	try {
	    const blog = await blogSchema.findOne({ slug }).orFail()
		console.log("API blog:", JSON.stringify(blog, null, 2));
	    return NextResponse.json(blog)

    } catch (err) {
	    return NextResponse.json('Blog not found.', { status: 404 })
	}
}