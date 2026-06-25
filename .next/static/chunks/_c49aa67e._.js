(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/constants/workflow-templates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_WORKFLOW_TEMPLATES",
    ()=>DEFAULT_WORKFLOW_TEMPLATES
]);
const DEFAULT_WORKFLOW_TEMPLATES = [
    {
        id: 'tpl_oe',
        type: 'oe',
        title: 'Open Enrollment',
        builtin: true,
        anchor: 'oe',
        autoStartDays: null,
        sections: [
            {
                name: 'Planning',
                tasks: [
                    {
                        label: 'Initial Meeting',
                        offsetDays: null
                    },
                    {
                        label: 'Confirm Plans',
                        offsetDays: null
                    },
                    {
                        label: 'Confirm Contributions',
                        offsetDays: null
                    }
                ]
            },
            {
                name: 'Documentation',
                tasks: [
                    {
                        label: 'Send ASA / BSA',
                        offsetDays: null
                    },
                    {
                        label: 'Receive ASA / BSA',
                        offsetDays: null
                    },
                    {
                        label: 'Send Census',
                        offsetDays: null
                    },
                    {
                        label: 'Receive Census',
                        offsetDays: null
                    }
                ]
            },
            {
                name: 'Communication',
                tasks: [
                    {
                        label: 'Create Landing Page',
                        offsetDays: null
                    },
                    {
                        label: 'Create Flyer',
                        offsetDays: null
                    },
                    {
                        label: 'Approve Flyer',
                        offsetDays: null
                    },
                    {
                        label: 'Send Flyer',
                        offsetDays: null
                    }
                ]
            },
            {
                name: 'Enrollment',
                tasks: [
                    {
                        label: 'Schedule Demo',
                        offsetDays: null
                    },
                    {
                        label: 'Conduct Demo',
                        offsetDays: null
                    },
                    {
                        label: 'Midpoint Review',
                        offsetDays: null
                    },
                    {
                        label: 'Enrollment Analysis',
                        offsetDays: null
                    }
                ]
            },
            {
                name: 'Completion',
                tasks: [
                    {
                        label: 'Send Invoice',
                        offsetDays: null
                    },
                    {
                        label: 'Confirm Invoice',
                        offsetDays: null
                    },
                    {
                        label: 'Send Section 125 Documents',
                        offsetDays: null
                    },
                    {
                        label: 'Schedule Ongoing Service Meetings',
                        offsetDays: null
                    }
                ]
            }
        ]
    },
    {
        id: 'tpl_renewal',
        type: 'renewal',
        title: 'Renewal',
        builtin: true,
        anchor: 'renewal',
        autoStartDays: 90,
        sections: [
            {
                name: 'Timeline',
                tasks: [
                    {
                        label: 'Initial Outreach',
                        offsetDays: 90
                    },
                    {
                        label: 'Renewal Review Meeting',
                        offsetDays: 75
                    },
                    {
                        label: 'Confirm Changes',
                        offsetDays: 60
                    },
                    {
                        label: 'Finalize Plan Design',
                        offsetDays: 45
                    },
                    {
                        label: 'Launch Open Enrollment',
                        offsetDays: 30
                    },
                    {
                        label: 'Enrollment Review',
                        offsetDays: 15
                    },
                    {
                        label: 'Renewal Complete',
                        offsetDays: 0
                    }
                ]
            }
        ]
    },
    {
        id: 'tpl_transition',
        type: 'transition',
        title: 'Transition',
        builtin: true,
        anchor: null,
        autoStartDays: null,
        sections: [
            {
                name: 'Hand-off',
                tasks: [
                    {
                        label: 'Warm hand-off received',
                        offsetDays: null
                    },
                    {
                        label: 'Intro / welcome call made',
                        offsetDays: null
                    },
                    {
                        label: 'Take full ownership',
                        offsetDays: null
                    }
                ]
            },
            {
                name: 'Setup',
                tasks: [
                    {
                        label: 'Update account owner in Salesforce',
                        offsetDays: null
                    },
                    {
                        label: 'Confirm plans & contributions',
                        offsetDays: null
                    },
                    {
                        label: 'Schedule first service meeting',
                        offsetDays: null
                    },
                    {
                        label: 'Transition complete',
                        offsetDays: null
                    }
                ]
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useTemplates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreateTemplate",
    ()=>useCreateTemplate,
    "useDeleteTemplate",
    ()=>useDeleteTemplate,
    "useResetTemplates",
    ()=>useResetTemplates,
    "useTemplates",
    ()=>useTemplates,
    "useUpdateTemplate",
    ()=>useUpdateTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/workflow-templates.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
'use client';
;
;
async function fetchTemplates() {
    const res = await fetch('/api/templates');
    if (!res.ok) return __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WORKFLOW_TEMPLATES"];
    return res.json();
}
function useTemplates() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'templates'
        ],
        queryFn: fetchTemplates
    });
}
_s(useTemplates, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useUpdateTemplate() {
    _s1();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUpdateTemplate.useMutation": (param)=>{
                let { id, patch } = param;
                return fetch("/api/templates/".concat(id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(patch)
                }).then({
                    "useUpdateTemplate.useMutation": (r)=>r.json()
                }["useUpdateTemplate.useMutation"]);
            }
        }["useUpdateTemplate.useMutation"],
        onMutate: {
            "useUpdateTemplate.useMutation": async (param)=>{
                let { id, patch } = param;
                await qc.cancelQueries({
                    queryKey: [
                        'templates'
                    ]
                });
                const prev = qc.getQueryData([
                    'templates'
                ]);
                qc.setQueryData([
                    'templates'
                ], {
                    "useUpdateTemplate.useMutation": (old)=>old ? old.map({
                            "useUpdateTemplate.useMutation": (t)=>t.id === id ? {
                                    ...t,
                                    ...patch
                                } : t
                        }["useUpdateTemplate.useMutation"]) : old
                }["useUpdateTemplate.useMutation"]);
                return {
                    prev
                };
            }
        }["useUpdateTemplate.useMutation"],
        onError: {
            "useUpdateTemplate.useMutation": (_err, _v, ctx)=>{
                if (ctx === null || ctx === void 0 ? void 0 : ctx.prev) qc.setQueryData([
                    'templates'
                ], ctx.prev);
            }
        }["useUpdateTemplate.useMutation"],
        onSettled: {
            "useUpdateTemplate.useMutation": ()=>qc.invalidateQueries({
                    queryKey: [
                        'templates'
                    ]
                })
        }["useUpdateTemplate.useMutation"]
    });
}
_s1(useUpdateTemplate, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useCreateTemplate() {
    _s2();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useCreateTemplate.useMutation": (title)=>fetch('/api/templates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        sections: [
                            {
                                name: 'Tasks',
                                tasks: []
                            }
                        ]
                    })
                }).then({
                    "useCreateTemplate.useMutation": (r)=>r.json()
                }["useCreateTemplate.useMutation"])
        }["useCreateTemplate.useMutation"],
        onSuccess: {
            "useCreateTemplate.useMutation": (newTpl)=>{
                qc.setQueryData([
                    'templates'
                ], {
                    "useCreateTemplate.useMutation": (old)=>[
                            ...old || [],
                            newTpl
                        ]
                }["useCreateTemplate.useMutation"]);
            }
        }["useCreateTemplate.useMutation"]
    });
}
_s2(useCreateTemplate, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteTemplate() {
    _s3();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteTemplate.useMutation": (id)=>fetch("/api/templates/".concat(id), {
                    method: 'DELETE'
                }).then({
                    "useDeleteTemplate.useMutation": (r)=>r.json()
                }["useDeleteTemplate.useMutation"])
        }["useDeleteTemplate.useMutation"],
        onMutate: {
            "useDeleteTemplate.useMutation": async (id)=>{
                await qc.cancelQueries({
                    queryKey: [
                        'templates'
                    ]
                });
                const prev = qc.getQueryData([
                    'templates'
                ]);
                qc.setQueryData([
                    'templates'
                ], {
                    "useDeleteTemplate.useMutation": (old)=>old ? old.filter({
                            "useDeleteTemplate.useMutation": (t)=>t.id !== id
                        }["useDeleteTemplate.useMutation"]) : old
                }["useDeleteTemplate.useMutation"]);
                return {
                    prev
                };
            }
        }["useDeleteTemplate.useMutation"],
        onError: {
            "useDeleteTemplate.useMutation": (_err, _id, ctx)=>{
                if (ctx === null || ctx === void 0 ? void 0 : ctx.prev) qc.setQueryData([
                    'templates'
                ], ctx.prev);
            }
        }["useDeleteTemplate.useMutation"]
    });
}
_s3(useDeleteTemplate, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useResetTemplates() {
    _s4();
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useResetTemplates.useMutation": async ()=>{
                // Delete all custom templates and re-seed built-ins via API
                const templates = qc.getQueryData([
                    'templates'
                ]) || [];
                const custom = templates.filter({
                    "useResetTemplates.useMutation.custom": (t)=>!t.builtin
                }["useResetTemplates.useMutation.custom"]);
                await Promise.all(custom.map({
                    "useResetTemplates.useMutation": (t)=>fetch("/api/templates/".concat(t.id), {
                            method: 'DELETE'
                        })
                }["useResetTemplates.useMutation"]));
                // Re-seed built-ins if needed
                for (const tpl of __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_WORKFLOW_TEMPLATES"]){
                    await fetch("/api/templates/".concat(tpl.id), {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: tpl.title,
                            sections: tpl.sections
                        })
                    });
                }
                return fetch('/api/templates').then({
                    "useResetTemplates.useMutation": (r)=>r.json()
                }["useResetTemplates.useMutation"]);
            }
        }["useResetTemplates.useMutation"],
        onSuccess: {
            "useResetTemplates.useMutation": (data)=>qc.setQueryData([
                    'templates'
                ], data)
        }["useResetTemplates.useMutation"]
    });
}
_s4(useResetTemplates, "ec0A66mtyLA0kdwNsMUsaWj/EHM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/templates/TemplateCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemplateCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function typeBadge(type, builtin) {
    if (!builtin) return {
        label: 'Custom',
        className: 'bg-canvas-subtle text-ink-faint'
    };
    switch(type){
        case 'oe':
            return {
                label: 'Open Enrollment',
                className: 'bg-accent/10 text-accent'
            };
        case 'renewal':
            return {
                label: 'Renewal',
                className: 'bg-accent/10 text-accent'
            };
        case 'transition':
            return {
                label: 'Transition',
                className: 'bg-accent/10 text-accent'
            };
        default:
            return {
                label: type,
                className: 'bg-canvas-subtle text-ink-faint'
            };
    }
}
function totalTasks(sections) {
    return sections.reduce((sum, s)=>sum + s.tasks.length, 0);
}
function cloneSections(sections) {
    return sections.map((s)=>({
            name: s.name,
            tasks: s.tasks.map((t)=>({
                    label: t.label,
                    offsetDays: t.offsetDays
                }))
        }));
}
function TemplateCard(param) {
    let { template, isEditing, onToggleEdit, onUpdate, onDelete } = param;
    const badge = typeBadge(template.type, template.builtin);
    const showOffset = template.anchor === 'renewal' || template.anchor === 'oe';
    // -- helpers that produce a new sections array and call onUpdate ----------------
    function updateSectionName(si, value) {
        const sections = cloneSections(template.sections);
        sections[si].name = value;
        onUpdate({
            sections
        });
    }
    function updateTaskLabel(si, ti, value) {
        const sections = cloneSections(template.sections);
        sections[si].tasks[ti].label = value;
        onUpdate({
            sections
        });
    }
    function updateTaskOffset(si, ti, raw) {
        const sections = cloneSections(template.sections);
        sections[si].tasks[ti].offsetDays = raw === '' ? null : parseInt(raw, 10);
        onUpdate({
            sections
        });
    }
    function addTask(si) {
        const sections = cloneSections(template.sections);
        sections[si].tasks.push({
            label: 'New task',
            offsetDays: null
        });
        onUpdate({
            sections
        });
    }
    function removeTask(si, ti) {
        const sections = cloneSections(template.sections);
        sections[si].tasks.splice(ti, 1);
        onUpdate({
            sections
        });
    }
    function addSection() {
        const sections = cloneSections(template.sections);
        sections.push({
            name: 'New section',
            tasks: []
        });
        onUpdate({
            sections
        });
    }
    function removeSection(si) {
        const sections = cloneSections(template.sections);
        sections.splice(si, 1);
        onUpdate({
            sections
        });
    }
    function handleDelete() {
        if (window.confirm('Delete template "'.concat(template.title, '"? This cannot be undone.'))) {
            onDelete();
        }
    }
    // ---------------------------------------------------------------------------
    // VIEW (not editing)
    // ---------------------------------------------------------------------------
    if (!isEditing) {
        const taskCount = totalTasks(template.sections);
        const sectionCount = template.sections.length;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-lg text-ink leading-snug",
                                        children: template.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/TemplateCard.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ".concat(badge.className),
                                        children: badge.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/TemplateCard.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-ink-faint",
                                children: [
                                    taskCount,
                                    " ",
                                    taskCount === 1 ? 'task' : 'tasks',
                                    " across",
                                    ' ',
                                    sectionCount,
                                    " ",
                                    sectionCount === 1 ? 'section' : 'sections'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/templates/TemplateCard.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggleEdit,
                        className: "shrink-0 text-sm font-medium text-accent hover:text-accent-hover transition-colors",
                        children: "Edit →"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplateCard.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/TemplateCard.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/templates/TemplateCard.tsx",
            lineNumber: 106,
            columnNumber: 7
        }, this);
    }
    // ---------------------------------------------------------------------------
    // EDIT VIEW
    // ---------------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: template.title,
                    onChange: (e)=>onUpdate({
                            title: e.target.value
                        }),
                    className: "w-full text-xl font-semibold text-ink bg-transparent border-b border-line focus:border-accent focus:outline-none pb-1 transition-colors",
                    placeholder: "Template title"
                }, void 0, false, {
                    fileName: "[project]/components/templates/TemplateCard.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/templates/TemplateCard.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-5",
                children: template.sections.map((section, si)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-line bg-canvas-subtle p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: section.name,
                                        onChange: (e)=>updateSectionName(si, e.target.value),
                                        className: "flex-1 text-sm font-semibold text-ink bg-transparent border-b border-line focus:border-accent focus:outline-none pb-0.5 transition-colors",
                                        placeholder: "Section name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/TemplateCard.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>removeSection(si),
                                        className: "shrink-0 text-xs text-red-400 hover:text-red-500 transition-colors",
                                        children: "× Remove section"
                                    }, void 0, false, {
                                        fileName: "[project]/components/templates/TemplateCard.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: section.tasks.map((task, ti)=>{
                                    var _task_offsetDays;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: task.label,
                                                onChange: (e)=>updateTaskLabel(si, ti, e.target.value),
                                                className: "flex-1 text-sm text-ink bg-canvas rounded-lg border border-line px-2.5 py-1.5 focus:border-accent focus:outline-none transition-colors min-w-0",
                                                placeholder: "Task label"
                                            }, void 0, false, {
                                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, this),
                                            showOffset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: (_task_offsetDays = task.offsetDays) !== null && _task_offsetDays !== void 0 ? _task_offsetDays : '',
                                                onChange: (e)=>updateTaskOffset(si, ti, e.target.value),
                                                className: "w-24 shrink-0 text-sm text-ink bg-canvas rounded-lg border border-line px-2.5 py-1.5 focus:border-accent focus:outline-none transition-colors text-right",
                                                placeholder: "days before"
                                            }, void 0, false, {
                                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                                lineNumber: 182,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeTask(si, ti),
                                                className: "shrink-0 text-ink-faint hover:text-red-400 transition-colors text-base leading-none",
                                                "aria-label": "Remove task",
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, ti, true, {
                                        fileName: "[project]/components/templates/TemplateCard.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>addTask(si),
                                className: "mt-3 text-xs text-accent hover:text-accent-hover font-medium transition-colors",
                                children: "+ Add task"
                            }, void 0, false, {
                                fileName: "[project]/components/templates/TemplateCard.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this)
                        ]
                    }, si, true, {
                        fileName: "[project]/components/templates/TemplateCard.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/templates/TemplateCard.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: addSection,
                className: "mt-4 text-sm text-accent hover:text-accent-hover font-medium transition-colors",
                children: "+ Add section"
            }, void 0, false, {
                fileName: "[project]/components/templates/TemplateCard.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 pt-4 border-t border-line flex items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggleEdit,
                        className: "text-sm font-medium text-ink-faint hover:text-ink transition-colors",
                        children: "← Done"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplateCard.tsx",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this),
                    !template.builtin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDelete,
                        className: "text-sm font-medium text-red-400 hover:text-red-500 transition-colors",
                        children: "Delete template"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplateCard.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/TemplateCard.tsx",
                lineNumber: 221,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/TemplateCard.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_c = TemplateCard;
var _c;
__turbopack_context__.k.register(_c, "TemplateCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/templates/TemplatesView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TemplatesView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useTemplates.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$TemplateCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/templates/TemplateCard.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function TemplatesView() {
    _s();
    const { data: templates, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTemplates"])();
    const updateTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTemplate"])();
    const createTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateTemplate"])();
    const deleteTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteTemplate"])();
    const resetTemplates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResetTemplates"])();
    const [editTplId, setEditTplId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    function handleToggleEdit(id) {
        setEditTplId((prev)=>prev === id ? null : id);
    }
    function handleUpdate(id, patch) {
        updateTemplate.mutate({
            id,
            patch
        });
    }
    function handleDelete(id) {
        deleteTemplate.mutate(id);
        if (editTplId === id) setEditTplId(null);
    }
    async function handleCreate() {
        const result = await createTemplate.mutateAsync('New custom workflow');
        if (result === null || result === void 0 ? void 0 : result.id) {
            setEditTplId(result.id);
        }
    }
    function handleReset() {
        if (window.confirm('Reset all templates to defaults? This will remove custom templates and restore built-in templates to their original state.')) {
            resetTemplates.mutate(undefined, {
                onSuccess: ()=>setEditTplId(null)
            });
        }
    }
    // ---------------------------------------------------------------------------
    // Loading
    // ---------------------------------------------------------------------------
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-8 py-6 max-w-[900px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-7 w-48 bg-canvas-subtle rounded-lg animate-pulse mb-2"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/TemplatesView.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-80 bg-canvas-subtle rounded animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/templates/TemplatesView.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/templates/TemplatesView.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                [
                    1,
                    2,
                    3
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-canvas rounded-2xl border border-line shadow-sm p-5 mb-4 animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-40 bg-canvas-subtle rounded mb-2"
                            }, void 0, false, {
                                fileName: "[project]/components/templates/TemplatesView.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-24 bg-canvas-subtle rounded"
                            }, void 0, false, {
                                fileName: "[project]/components/templates/TemplatesView.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/templates/TemplatesView.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/components/templates/TemplatesView.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    const templateList = templates !== null && templates !== void 0 ? templates : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-8 py-6 max-w-[900px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold text-ink",
                        children: "Workflow templates"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplatesView.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-ink-faint",
                        children: "Define the sections and tasks used when starting a workflow for a group. Built-in templates can be edited but not deleted."
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplatesView.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/TemplatesView.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            templateList.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-ink-faint py-4",
                children: "No templates found."
            }, void 0, false, {
                fileName: "[project]/components/templates/TemplatesView.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this) : templateList.map((tpl)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$templates$2f$TemplateCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    template: tpl,
                    isEditing: editTplId === tpl.id,
                    onToggleEdit: ()=>handleToggleEdit(tpl.id),
                    onUpdate: (patch)=>handleUpdate(tpl.id, patch),
                    onDelete: ()=>handleDelete(tpl.id)
                }, tpl.id, false, {
                    fileName: "[project]/components/templates/TemplatesView.tsx",
                    lineNumber: 96,
                    columnNumber: 11
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCreate,
                        disabled: createTemplate.isPending,
                        className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        children: "+ New custom workflow"
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplatesView.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReset,
                        disabled: resetTemplates.isPending,
                        className: "text-sm text-ink-faint hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        children: resetTemplates.isPending ? 'Resetting…' : 'Reset all to defaults'
                    }, void 0, false, {
                        fileName: "[project]/components/templates/TemplatesView.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/templates/TemplatesView.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/templates/TemplatesView.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_s(TemplatesView, "ccczxncZ/nlhU8tQ6kW5GgI6NFY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTemplates"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateTemplate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCreateTemplate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteTemplate"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useTemplates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResetTemplates"]
    ];
});
_c = TemplatesView;
var _c;
__turbopack_context__.k.register(_c, "TemplatesView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c49aa67e._.js.map