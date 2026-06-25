(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/groups/FilterChips.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FilterChips
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const chips = [
    {
        label: 'All',
        value: 'all'
    },
    {
        label: 'Reach out',
        value: 'reachout'
    },
    {
        label: 'On OE',
        value: 'oenow'
    },
    {
        label: '90 days out',
        value: 'oe90'
    },
    {
        label: 'In transition',
        value: 'transition'
    },
    {
        label: 'Follow-ups',
        value: 'followup'
    },
    {
        label: 'Flagged',
        value: 'priority'
    }
];
function FilterChips() {
    _s();
    const { listFilter, setListFilter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap items-center gap-2",
        children: chips.map((chip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "data-filter": chip.value,
                onClick: ()=>setListFilter(chip.value),
                className: [
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    listFilter === chip.value ? 'bg-accent text-white' : 'bg-canvas-subtle text-ink-faint hover:bg-canvas hover:text-ink border border-line'
                ].join(' '),
                children: chip.label
            }, chip.value, false, {
                fileName: "[project]/components/groups/FilterChips.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/groups/FilterChips.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(FilterChips, "g7R9+g3BzhsS1+yrjl91HtTw+Ks=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"]
    ];
});
_c = FilterChips;
var _c;
__turbopack_context__.k.register(_c, "FilterChips");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/groups/SortDropdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SortDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const options = [
    {
        label: 'Priority',
        value: 'priority'
    },
    {
        label: 'Name A–Z',
        value: 'name'
    },
    {
        label: 'Renewal date',
        value: 'renewal'
    },
    {
        label: 'Employees',
        value: 'employees'
    }
];
function SortDropdown() {
    _s();
    const { sort, setSort } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        value: sort,
        onChange: (e)=>setSort(e.target.value),
        className: "border border-line rounded-lg px-3 py-2 text-sm bg-canvas text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
        children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: opt.value,
                children: opt.label
            }, opt.value, false, {
                fileName: "[project]/components/groups/SortDropdown.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/groups/SortDropdown.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(SortDropdown, "9z3/Vnja/7NUvWRDgm9NeoD8dtM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"]
    ];
});
_c = SortDropdown;
var _c;
__turbopack_context__.k.register(_c, "SortDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/StatusBadge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/scoring.ts [app-client] (ecmascript) <locals>");
'use client';
;
;
function StatusBadge(param) {
    let { status } = param;
    const info = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["statusInfo"])(status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        style: {
            backgroundColor: info.color + '22',
            color: info.color,
            border: "1px solid ".concat(info.color, "44")
        },
        children: info.label
    }, void 0, false, {
        fileName: "[project]/components/ui/StatusBadge.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = StatusBadge;
var _c;
__turbopack_context__.k.register(_c, "StatusBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/groups/GroupRow.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GroupRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useGroups.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/StatusBadge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const oeWindowBadge = {
    now: {
        label: 'Now',
        cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    soon: {
        label: 'Soon',
        cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    passed: {
        label: 'Passed',
        cls: 'bg-canvas-subtle text-ink-faint'
    },
    future: {
        label: '',
        cls: ''
    },
    none: {
        label: '',
        cls: ''
    }
};
function GroupRow(param) {
    let { group: g } = param;
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const updateGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateGroup"])();
    function handlePriorityToggle(e) {
        e.stopPropagation();
        updateGroup.mutate({
            id: g.id,
            patch: {
                priority: !g.priority
            }
        });
    }
    const nextContact = g.followUpDate || g.nextCheckIn;
    const nextContactDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["daysUntil"])(nextContact);
    const nextContactOverdue = nextContactDays !== null && nextContactDays < 0;
    const oeBadge = oeWindowBadge[g.oeWindow];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: ()=>router.push("/groups/".concat(g.id)),
        className: "flex items-center gap-3 px-4 py-3 border-b border-line hover:bg-canvas-subtle cursor-pointer transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-medium text-sm text-ink truncate",
                        children: g.groupName
                    }, void 0, false, {
                        fileName: "[project]/components/groups/GroupRow.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    g.status === 'transition' && g.transitionStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-ink-faint truncate",
                        children: g.transitionStep
                    }, void 0, false, {
                        fileName: "[project]/components/groups/GroupRow.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-ink-faint truncate",
                style: {
                    width: 120,
                    flexShrink: 0
                },
                children: g.currentBM || '—'
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 140,
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-ink-faint",
                        children: g.oeDateText
                    }, void 0, false, {
                        fileName: "[project]/components/groups/GroupRow.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    oeBadge.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ".concat(oeBadge.cls),
                        children: oeBadge.label
                    }, void 0, false, {
                        fileName: "[project]/components/groups/GroupRow.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 130,
                    flexShrink: 0
                },
                children: g.wfTotalAll > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-full bg-line rounded-full overflow-hidden mb-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-accent h-full transition-all",
                                style: {
                                    width: "".concat(g.wfPct, "%")
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/groups/GroupRow.tsx",
                                lineNumber: 68,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/groups/GroupRow.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-ink-faint",
                            children: [
                                g.wfDoneAll,
                                "/",
                                g.wfTotalAll,
                                " tasks"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/groups/GroupRow.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/GroupRow.tsx",
                    lineNumber: 66,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-ink-faint",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/components/groups/GroupRow.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 120,
                    flexShrink: 0
                },
                children: nextContact ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs ".concat(nextContactOverdue ? 'text-[oklch(0.47_0.16_30)] font-medium' : 'text-ink-faint'),
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fmt"])(nextContact)
                }, void 0, false, {
                    fileName: "[project]/components/groups/GroupRow.tsx",
                    lineNumber: 85,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs text-ink-faint",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/components/groups/GroupRow.tsx",
                    lineNumber: 89,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 130,
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$StatusBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    status: g.status
                }, void 0, false, {
                    fileName: "[project]/components/groups/GroupRow.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 44,
                    flexShrink: 0
                },
                className: "flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handlePriorityToggle,
                    className: "text-base hover:scale-110 transition-transform",
                    title: g.priority ? 'Remove flag' : 'Flag group',
                    children: g.priority ? '⭐' : '☆'
                }, void 0, false, {
                    fileName: "[project]/components/groups/GroupRow.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupRow.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/groups/GroupRow.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_s(GroupRow, "dyWE+/KUAvDc6tGyi9qwwFZ26sM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUpdateGroup"]
    ];
});
_c = GroupRow;
var _c;
__turbopack_context__.k.register(_c, "GroupRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/groups/GroupsTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GroupsTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$GroupRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/groups/GroupRow.tsx [app-client] (ecmascript)");
'use client';
;
;
const columns = [
    {
        label: 'Group',
        flex: true
    },
    {
        label: 'From BM',
        width: 120
    },
    {
        label: 'Open enrollment',
        width: 140
    },
    {
        label: 'Workflows',
        width: 130
    },
    {
        label: 'Next contact',
        width: 120
    },
    {
        label: 'Status',
        width: 130
    },
    {
        label: '★',
        width: 44
    }
];
function GroupsTable(param) {
    let { groups, loading } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-canvas rounded-2xl border border-line shadow-sm overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-2.5 border-b border-line bg-canvas-subtle sticky top-0 z-10",
                children: columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: [
                            'text-xs font-semibold text-ink-faint uppercase tracking-wide',
                            col.flex ? 'flex-1 min-w-0' : ''
                        ].join(' '),
                        style: col.width ? {
                            width: col.width,
                            flexShrink: 0
                        } : undefined,
                        children: col.label
                    }, col.label, false, {
                        fileName: "[project]/components/groups/GroupsTable.tsx",
                        lineNumber: 26,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupsTable.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-16 text-ink-faint text-sm",
                children: "Loading…"
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupsTable.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this) : groups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-16 text-ink-faint text-sm italic",
                children: "No groups match this filter."
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupsTable.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: groups.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$GroupRow$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        group: g
                    }, g.id, false, {
                        fileName: "[project]/components/groups/GroupsTable.tsx",
                        lineNumber: 51,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupsTable.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/groups/GroupsTable.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = GroupsTable;
var _c;
__turbopack_context__.k.register(_c, "GroupsTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/groups/GroupsView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GroupsView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useGroups.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/scoring.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$FilterChips$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/groups/FilterChips.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$SortDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/groups/SortDropdown.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$GroupsTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/groups/GroupsTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$AddGroupModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/groups/AddGroupModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function applyFilter(groups, filter) {
    switch(filter){
        case 'reachout':
            return groups.filter((g)=>g.score > 0 && !g.snoozed);
        case 'oenow':
            return groups.filter((g)=>g.oeWindow === 'now');
        case 'oe90':
            return groups.filter((g)=>g.oeWindow === 'soon');
        case 'transition':
            return groups.filter((g)=>g.status === 'transition');
        case 'followup':
            return groups.filter((g)=>g.followUpDue);
        case 'priority':
            return groups.filter((g)=>g.priority);
        default:
            return groups;
    }
}
function applySort(groups, sort) {
    const sorted = [
        ...groups
    ];
    switch(sort){
        case 'name':
            return sorted.sort((a, b)=>a.groupName.localeCompare(b.groupName));
        case 'renewal':
            return sorted.sort((a, b)=>{
                if (!a.renewalDate && !b.renewalDate) return 0;
                if (!a.renewalDate) return 1;
                if (!b.renewalDate) return -1;
                return a.renewalDate.localeCompare(b.renewalDate);
            });
        case 'employees':
            return sorted.sort((a, b)=>{
                var _b_employees, _a_employees;
                return ((_b_employees = b.employees) !== null && _b_employees !== void 0 ? _b_employees : 0) - ((_a_employees = a.employees) !== null && _a_employees !== void 0 ? _a_employees : 0);
            });
        case 'priority':
        default:
            return sorted.sort((a, b)=>{
                if (a.priority !== b.priority) return a.priority ? -1 : 1;
                return b.score - a.score;
            });
    }
}
function applySearch(groups, search) {
    if (!search.trim()) return groups;
    const q = search.trim().toLowerCase();
    return groups.filter((g)=>{
        var _g_contactName;
        return g.groupName.toLowerCase().includes(q) || g.currentBM.toLowerCase().includes(q) || ((_g_contactName = g.contactName) === null || _g_contactName === void 0 ? void 0 : _g_contactName.toLowerCase().includes(q));
    });
}
const VALID_FILTERS = [
    'all',
    'reachout',
    'oenow',
    'oe90',
    'transition',
    'followup',
    'priority'
];
function GroupsView(param) {
    let { initialFilter } = param;
    _s();
    const { data: rawGroups = [], isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroups"])();
    const { listFilter, setListFilter, sort, search } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"])();
    // Sync initialFilter from URL to store on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GroupsView.useEffect": ()=>{
            if (initialFilter && VALID_FILTERS.includes(initialFilter)) {
                setListFilter(initialFilter);
            }
        }
    }["GroupsView.useEffect"], [
        initialFilter,
        setListFilter
    ]);
    const groups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GroupsView.useMemo[groups]": ()=>{
            const vms = rawGroups.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scoring$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["buildVM"]);
            const filtered = applyFilter(vms, listFilter);
            const searched = applySearch(filtered, search);
            return applySort(searched, sort);
        }
    }["GroupsView.useMemo[groups]"], [
        rawGroups,
        listFilter,
        sort,
        search
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-8 py-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-5 gap-4 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$FilterChips$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/groups/GroupsView.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$SortDropdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/groups/GroupsView.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/groups/GroupsView.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$GroupsTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                groups: groups,
                loading: isLoading
            }, void 0, false, {
                fileName: "[project]/components/groups/GroupsView.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$groups$2f$AddGroupModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/groups/GroupsView.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/groups/GroupsView.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(GroupsView, "qgkohXhmW/KXVrGp6/2ODjgB2lE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroups"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUIStore"]
    ];
});
_c = GroupsView;
var _c;
__turbopack_context__.k.register(_c, "GroupsView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_eb85aa41._.js.map