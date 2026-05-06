module.exports = [
"[project]/personalWebsite/src/components/blogPreview/blogPreview.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "blog": "blogPreview-module__2BqwRW__blog",
  "blogImage": "blogPreview-module__2BqwRW__blogImage",
  "blogText": "blogPreview-module__2BqwRW__blogText",
  "blogTitle": "blogPreview-module__2BqwRW__blogTitle",
  "commentTitle": "blogPreview-module__2BqwRW__commentTitle",
  "contactText": "blogPreview-module__2BqwRW__contactText",
  "errorText": "blogPreview-module__2BqwRW__errorText",
  "input": "blogPreview-module__2BqwRW__input",
  "schoolContainer": "blogPreview-module__2BqwRW__schoolContainer",
  "submit": "blogPreview-module__2BqwRW__submit",
});
}),
"[project]/personalWebsite/src/components/comment/comment.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "commentContainer": "comment-module__WXg2Ya__commentContainer",
  "commentText": "comment-module__WXg2Ya__commentText",
  "comments": "comment-module__WXg2Ya__comments",
  "dateText": "comment-module__WXg2Ya__dateText",
  "userText": "comment-module__WXg2Ya__userText",
});
}),
"[project]/personalWebsite/src/components/comment/Comment.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$comment$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/personalWebsite/src/components/comment/comment.module.css [app-ssr] (css module)");
;
;
{}{}function parseCommentTime(time) {
    const date = time.toString();
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    const dayNumber = Number(day);
    const year = date.slice(0, 4);
    const months = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    };
    return months[month] + ' ' + dayNumber + ', ' + year;
}
function Comment({ comments }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$comment$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].comments,
        children: comments.map((comment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$comment$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].commentContainer,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$comment$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].userText,
                        children: comment.user
                    }, void 0, false, {
                        fileName: "[project]/personalWebsite/src/components/comment/Comment.tsx",
                        lineNumber: 55,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$comment$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].commentText,
                        children: comment.comment
                    }, void 0, false, {
                        fileName: "[project]/personalWebsite/src/components/comment/Comment.tsx",
                        lineNumber: 56,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$comment$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dateText,
                        children: parseCommentTime(comment.time)
                    }, void 0, false, {
                        fileName: "[project]/personalWebsite/src/components/comment/Comment.tsx",
                        lineNumber: 57,
                        columnNumber: 17
                    }, this)
                ]
            }, index, true, {
                fileName: "[project]/personalWebsite/src/components/comment/Comment.tsx",
                lineNumber: 54,
                columnNumber: 17
            }, this))
    }, void 0, false, {
        fileName: "[project]/personalWebsite/src/components/comment/Comment.tsx",
        lineNumber: 52,
        columnNumber: 9
    }, this);
}
const __TURBOPACK__default__export__ = Comment;
}),
"[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlogPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/personalWebsite/src/components/blogPreview/blogPreview.module.css [app-ssr] (css module)");
// import type { Blog } from '../../app/blogData'
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$Comment$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/src/components/comment/Comment.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/personalWebsite/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function BlogPreview({ title, date, description, image, imageAlt, comments, slug }) {
    const [localComments, setLocalComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(comments);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleClick = async (e)=>{
        e.preventDefault();
        setError(null);
        const form = document.getElementById("contact-form");
        if (!form) {
            console.error("Form not found");
            return;
        }
        const formData = new FormData(form);
        const name = formData.get("name");
        const comment = formData.get("comment");
        if (!name || !comment) {
            setError("Please fill out both fields.");
            return;
        }
        try {
            // setIsSubmitting(true);
            const res = await fetch(`/api/blog/${slug}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: name,
                    comment
                })
            });
            if (!res.ok) {
                const data = await res.json().catch(()=>null);
                setError(data?.error || "Failed to submit comment.");
                return;
            }
            const updatedBlog = await res.json();
            if (updatedBlog?.comments) {
                setLocalComments(updatedBlog.comments);
            } else {
                setLocalComments((prev)=>[
                        ...prev,
                        {
                            user: name,
                            comment,
                            time: new Date()
                        }
                    ]);
            }
            form.reset();
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally{
        // setIsSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blog,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].schoolContainer,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blogTitle,
                    children: title
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 88,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blogText,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: date
                    }, void 0, false, {
                        fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                        lineNumber: 89,
                        columnNumber: 45
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 89,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blogText,
                    children: description
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 90,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blogImage,
                    src: image,
                    alt: imageAlt,
                    width: 200
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 91,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].commentTitle,
                    children: "Comments: "
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 92,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].errorText,
                    children: error
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 93,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    id: "contact-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                            type: "text",
                            id: "name",
                            name: "name",
                            placeholder: "Name",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 95,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 103,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 103,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                            id: "comment",
                            name: "comment",
                            placeholder: "Comment",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 104,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 111,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 111,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$blogPreview$2f$blogPreview$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submit,
                            type: "submit",
                            value: "Submit",
                            onClick: handleClick
                        }, void 0, false, {
                            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                            lineNumber: 112,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 94,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$personalWebsite$2f$src$2f$components$2f$comment$2f$Comment$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    comments: localComments
                }, void 0, false, {
                    fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
                    lineNumber: 119,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
            lineNumber: 87,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/personalWebsite/src/components/blogPreview/blogPreview.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
}),
"[project]/personalWebsite/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/personalWebsite/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=personalWebsite_db9ff23c._.js.map