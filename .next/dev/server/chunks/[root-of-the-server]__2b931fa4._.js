module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/personalWebsite/src/database/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// db.ts
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const url = process.env.MONGO_URI;
console.log("MONGODB_URI in db.ts:", url);
if (!url) {
    throw new Error("MONGODB_URI is missing. Check your env and imports.");
}
let connection;
/**
 * Makes a connection to a MongoDB database. If a connection already exists, does nothing
 * Call this function at the start of api routes and data fetches
 * @returns {Promise<typeof mongoose>}
 */ const connectDB = async ()=>{
    if (!connection) {
        connection = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(url);
        return connection;
    }
};
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/personalWebsite/src/database/blogSchema.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const commentSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    user: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
});
// mongoose schema
const blogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    // date: { type: Date, required: false, default: new Date()},
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imageAlt: {
        type: String,
        required: true
    },
    comments: {
        type: [
            commentSchema
        ],
        required: true
    },
    slug: {
        type: String,
        required: true
    }
});
// defining the collection and model
const Blog = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models['blogs'] || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('blogs', blogSchema);
const __TURBOPACK__default__export__ = Blog;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/personalWebsite/src/app/api/blog/[slug]/comment/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$database$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/src/database/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$database$2f$blogSchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/src/database/blogSchema.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
async function POST(req, { params }) {
    const { slug } = await params;
    const body = await req.json();
    const { user, comment } = body;
    if (!user || !comment || typeof user != "string" || typeof comment != "string") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid body of comment"
        }, {
            status: 400
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$database$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    console.log("Connected DB:", __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$database$2f$blogSchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].db.name);
    console.log("Looking for slug:", slug);
    const allBlogs = await __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$database$2f$blogSchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({}, "slug title").lean();
    console.log("All blog slugs:", allBlogs);
    const newComment = {
        user,
        comment,
        time: new Date()
    };
    const updatedBlog = await __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$database$2f$blogSchema$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
        slug: slug
    }, {
        $push: {
            comments: newComment
        }
    }, {
        new: true
    });
    if (!updatedBlog) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Blog not found"
        }, {
            status: 404
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedBlog, {
        status: 200
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b931fa4._.js.map