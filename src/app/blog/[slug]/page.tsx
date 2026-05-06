import BlogPreview from "../../../components/blogPreview/blogPreview"
import style from "../blog.module.css";

type Props = {
    params: Promise<{ slug: string }>
    // params: { slug: string }
}

async function getBlog(slug: string) {
	try {
		// This fetches the blog from an api endpoint that would GET the blog

		const baseURL = process.env.NEXT_PUBLIC_PROD_URL!;
		console.log("BASE URL:", baseURL)

		const res = await fetch(`${baseURL}/api/blog/${slug}`, {
			cache: "no-store",
		})
		// This checks that the GET request was successful
		if (!res.ok) {
			throw new Error("Failed to fetch blog");
		}

		return res.json();
	} catch (err: unknown) {
		console.log(`error: ${err}`);
		return null;
		// `` are a special way of allowing JS inside a string
		// Instead of "error: " + err, we can just do the above
		// it is simular to formated strings in python --> f"{err}"
	}
}

export default async function Blog(props: Props) {
	const { slug } = await props.params;

    const blog = await getBlog(slug);
	console.log("Page blog:", JSON.stringify(blog, null, 2));

	if (!blog) {
		console.log("Blog was null for slug:", slug);
		return <div>Blog not found for slug: {slug}</div>;
	}


	return (
        <div className = {style.height}>
			<div>
				<BlogPreview
					key = {blog.slug}
					title = {blog.title}
					date = {blog.date}
					description = {blog.description}
					image = {blog.image}
					imageAlt = {blog.imageAlt}
					comments = {blog.comments}
					slug = {blog.slug}
				/>
			</div>
		</div>
    )
}