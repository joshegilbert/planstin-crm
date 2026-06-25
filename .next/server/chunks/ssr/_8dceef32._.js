module.exports = [
"[project]/hooks/useGroups.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreateGroup",
    ()=>useCreateGroup,
    "useDeleteGroup",
    ()=>useDeleteGroup,
    "useGroups",
    ()=>useGroups,
    "useUpdateGroup",
    ()=>useUpdateGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
'use client';
;
async function fetchGroups() {
    const res = await fetch('/api/groups');
    if (!res.ok) throw new Error('Failed to fetch groups');
    return res.json();
}
function useGroups() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'groups'
        ],
        queryFn: fetchGroups
    });
}
function useCreateGroup() {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (body)=>fetch('/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then((r)=>r.json()),
        onSuccess: ()=>qc.invalidateQueries({
                queryKey: [
                    'groups'
                ]
            })
    });
}
function useUpdateGroup() {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ id, patch })=>fetch(`/api/groups/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patch)
            }).then((r)=>r.json()),
        onMutate: async ({ id, patch })=>{
            await qc.cancelQueries({
                queryKey: [
                    'groups'
                ]
            });
            await qc.cancelQueries({
                queryKey: [
                    'group',
                    id
                ]
            });
            const prevGroups = qc.getQueryData([
                'groups'
            ]);
            const prevGroup = qc.getQueryData([
                'group',
                id
            ]);
            qc.setQueryData([
                'groups'
            ], (old)=>old ? old.map((g)=>g.id === id ? {
                        ...g,
                        ...patch
                    } : g) : old);
            qc.setQueryData([
                'group',
                id
            ], (old)=>old ? {
                    ...old,
                    ...patch
                } : old);
            return {
                prevGroups,
                prevGroup
            };
        },
        onError: (_err, { id }, ctx)=>{
            if (ctx?.prevGroups) qc.setQueryData([
                'groups'
            ], ctx.prevGroups);
            if (ctx?.prevGroup) qc.setQueryData([
                'group',
                id
            ], ctx.prevGroup);
        },
        onSettled: (_data, _err, { id })=>{
            qc.invalidateQueries({
                queryKey: [
                    'groups'
                ]
            });
            qc.invalidateQueries({
                queryKey: [
                    'group',
                    id
                ]
            });
        }
    });
}
function useDeleteGroup() {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (id)=>fetch(`/api/groups/${id}`, {
                method: 'DELETE'
            }).then((r)=>r.json()),
        onSuccess: ()=>qc.invalidateQueries({
                queryKey: [
                    'groups'
                ]
            })
    });
}
}),
"[project]/lib/dates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addInterval",
    ()=>addInterval,
    "daysUntil",
    ()=>daysUntil,
    "fmt",
    ()=>fmt,
    "guessDate",
    ()=>guessDate,
    "isoMinus",
    ()=>isoMinus,
    "isoPlus",
    ()=>isoPlus,
    "monAbbr",
    ()=>monAbbr,
    "parseISO",
    ()=>parseISO,
    "today",
    ()=>today,
    "todayISO",
    ()=>todayISO
]);
const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}
function todayISO() {
    const d = today();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function parseISO(iso) {
    if (!iso) return null;
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
}
function daysUntil(iso) {
    const d = parseISO(iso);
    if (!d) return null;
    return Math.round((d.getTime() - today().getTime()) / 86400000);
}
function fmt(iso) {
    const d = parseISO(iso);
    if (!d) return '—';
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}
function addInterval(iso, cadence, days) {
    const base = parseISO(iso) || today();
    const d = new Date(base);
    if (cadence === 'monthly') {
        d.setMonth(d.getMonth() + 1);
    } else if (cadence === 'quarterly') {
        d.setMonth(d.getMonth() + 3);
    } else if (cadence === 'custom' && days) {
        d.setDate(d.getDate() + Number(days));
    } else {
        return null;
    }
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function guessDate(str) {
    if (!str) return null;
    const m = str.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (!m) return null;
    const mo = Number(m[1]);
    const da = Number(m[2]);
    let yr = m[3] ? Number(m[3]) : null;
    if (yr && yr < 100) yr += 2000;
    const t = today();
    if (!yr) {
        yr = t.getFullYear();
        if (new Date(yr, mo - 1, da) < t) yr += 1;
    }
    return yr + '-' + String(mo).padStart(2, '0') + '-' + String(da).padStart(2, '0');
}
function monAbbr(iso) {
    const d = parseISO(iso);
    if (!d) return '';
    return MONTHS[d.getMonth()];
}
function isoMinus(iso, days) {
    const d = parseISO(iso);
    if (!d) return null;
    d.setDate(d.getDate() - days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function isoPlus(iso, days) {
    const d = parseISO(iso);
    if (!d) return null;
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
}),
"[project]/lib/scoring.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildVM",
    ()=>buildVM,
    "statusInfo",
    ()=>statusInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dates.ts [app-ssr] (ecmascript)");
;
function oeWindow(g) {
    const oeAnchor = g.oeStartDate || g.renewalDate;
    const oeDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(oeAnchor);
    const oeEndDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(g.oeEndDate);
    if (oeDays == null) return 'none';
    if (oeEndDays != null && oeEndDays < 0) return 'passed';
    if (oeDays < 0) return oeEndDays != null && oeEndDays >= 0 ? 'now' : 'passed';
    if (oeDays <= 45) return 'now';
    if (oeDays <= 90) return 'soon';
    return 'future';
}
function transitionStep(g) {
    if (g.changeCompleted) return 'Complete';
    if (!g.warmHandoff) return 'Awaiting hand-off';
    if (!g.newContact) return 'Make welcome call';
    if (!g.ownershipTaken) return 'Take ownership';
    if (!g.sfUpdated) return 'Update Salesforce';
    return 'Mark complete';
}
function buildVM(g) {
    const rd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(g.renewalDate);
    const renewalSub = rd == null ? '' : rd < 0 ? Math.abs(rd) + 'd ago' : rd === 0 ? 'today' : 'in ' + rd + 'd';
    const inTransition = g.status === 'transition';
    let wfTotalAll = 0;
    let wfDoneAll = 0;
    const wfCount = (g.workflows || []).length;
    (g.workflows || []).forEach((w)=>(w.sections || []).forEach((sec)=>(sec.tasks || []).forEach((t)=>{
                wfTotalAll++;
                if (t.completedDate) wfDoneAll++;
            })));
    const wfPct = wfTotalAll ? Math.round(wfDoneAll / wfTotalAll * 100) : 0;
    const hasTransitionWf = (g.workflows || []).some((w)=>w.type === 'transition');
    const hasRenewalWf = (g.workflows || []).some((w)=>w.type === 'renewal');
    const transitionStartSuggest = inTransition && !hasTransitionWf;
    const renewalStartSuggest = !hasRenewalWf && rd != null && rd >= 0 && rd <= 90;
    const ci = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(g.nextCheckIn);
    const checkInDue = ci != null && ci < 0;
    const checkInText = g.nextCheckIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fmt"])(g.nextCheckIn) : '—';
    const fu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(g.followUpDate);
    const followUpDue = fu != null && fu <= 0;
    const followUpText = g.followUpDate ? fu < 0 ? Math.abs(fu) + 'd ago' : fu === 0 ? 'Today' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fmt"])(g.followUpDate) : '';
    let cadenceLabel = 'Not set';
    if (g.cadence === 'monthly') cadenceLabel = 'Monthly';
    else if (g.cadence === 'quarterly') cadenceLabel = 'Quarterly';
    else if (g.cadence === 'custom') cadenceLabel = g.customCadenceDays ? 'Every ' + g.customCadenceDays + 'd' : 'Custom';
    let wfOverdue = 0;
    let wfDueSoon = 0;
    let nextWfTaskLabel = null;
    (g.workflows || []).forEach((w)=>(w.sections || []).forEach((sec)=>(sec.tasks || []).forEach((t)=>{
                if (t.completedDate) return;
                const du = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(t.dueDate);
                if (du == null) return;
                if (du < 0) wfOverdue++;
                else if (du <= 7) wfDueSoon++;
                if (!nextWfTaskLabel) nextWfTaskLabel = t.label;
            })));
    const monitorDue = !!g.monitorMonthly && (g.lastMonitor == null || ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(g.lastMonitor) ?? 0) <= -30);
    let score = 0;
    const reasons = [];
    if (followUpDue) {
        score += 130;
        reasons.push({
            label: fu < 0 ? 'Follow-up overdue' : 'Follow-up due',
            tone: 'urgent'
        });
    }
    if (checkInDue) {
        score += 75;
        reasons.push({
            label: 'Check-in overdue',
            tone: 'urgent'
        });
    }
    if (rd != null && rd < 0) {
        score += 95;
        reasons.push({
            label: 'Renewal passed',
            tone: 'urgent'
        });
    } else if (rd != null && rd <= 90) {
        score += rd <= 30 ? 85 : 50;
        reasons.push({
            label: rd <= 0 ? 'Renews now' : 'Renews in ' + rd + 'd',
            tone: rd <= 30 ? 'urgent' : 'warn'
        });
    }
    if (inTransition) {
        score += 40;
        reasons.push({
            label: 'In transition',
            tone: 'accent'
        });
    }
    if (transitionStartSuggest) {
        score += 25;
        reasons.push({
            label: 'Set up transition workflow',
            tone: 'accent'
        });
    }
    if (g.priority) {
        score += 110;
        reasons.push({
            label: 'Flagged',
            tone: 'warn'
        });
    }
    if (monitorDue) {
        score += 70;
        reasons.push({
            label: 'Monthly monitor',
            tone: 'warn'
        });
    }
    if (wfOverdue > 0) {
        score += 90;
        reasons.push({
            label: wfOverdue + ' task' + (wfOverdue > 1 ? 's' : '') + ' overdue',
            tone: 'urgent'
        });
    } else if (wfDueSoon > 0) {
        score += 45;
        reasons.push({
            label: wfDueSoon + ' task' + (wfDueSoon > 1 ? 's' : '') + ' due',
            tone: 'warn'
        });
    }
    if (renewalStartSuggest) {
        score += 55;
        reasons.push({
            label: 'Start renewal workflow',
            tone: 'accent'
        });
    }
    if (g.employees) score += Number(g.employees) * 0.4;
    const snz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["daysUntil"])(g.snoozedUntil);
    const snoozed = snz != null && snz > 0;
    const win = oeWindow(g);
    const oeDateText = g.oeStartDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fmt"])(g.oeStartDate) + (g.oeEndDate ? ' – ' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fmt"])(g.oeEndDate) : '') : 'Dates not set';
    let actionDetail = '';
    let dueText = '';
    let dueTone = 'neutral';
    if (followUpDue) {
        actionDetail = g.followUpNote ? 'Follow up — ' + g.followUpNote : 'Follow-up reminder is due';
        dueText = fu < 0 ? 'Overdue ' + Math.abs(fu) + 'd' : 'Due today';
        dueTone = 'urgent';
    } else if (checkInDue) {
        actionDetail = 'Check-in overdue — time to reach back out';
        dueText = 'Overdue ' + Math.abs(ci) + 'd';
        dueTone = 'urgent';
    } else if (monitorDue) {
        actionDetail = 'Monthly eligibility monitor due — confirm enrolled count';
        dueText = 'Monitor';
        dueTone = 'warn';
    } else if (wfOverdue > 0) {
        actionDetail = 'Workflow task overdue — ' + (nextWfTaskLabel ?? 'see tasks');
        dueText = wfOverdue + ' overdue';
        dueTone = 'urgent';
    } else if (renewalStartSuggest) {
        actionDetail = 'Renewal window open — start the renewal workflow';
        dueText = 'Renews in ' + rd + 'd';
        dueTone = 'warn';
    } else if (wfDueSoon > 0) {
        actionDetail = 'Workflow task coming due — ' + (nextWfTaskLabel ?? 'see tasks');
        dueText = 'Task due';
        dueTone = 'warn';
    } else if (rd != null && rd < 0) {
        actionDetail = 'Plan date has passed — confirm the renewal';
        dueText = Math.abs(rd) + 'd ago';
        dueTone = 'urgent';
    } else if (win === 'now') {
        actionDetail = 'Open enrollment is open — help finalize elections';
        dueText = rd != null ? 'OE in ' + rd + 'd' : 'OE active';
        dueTone = 'warn';
    } else if (inTransition) {
        actionDetail = hasTransitionWf ? 'Continue the transition workflow' : 'Set up the transition — attach the workflow';
        dueText = g.transitionTimeline ? 'Window ' + g.transitionTimeline : 'In transition';
        dueTone = 'accent';
    } else if (g.priority) {
        actionDetail = 'Flagged for attention';
        dueText = 'Flagged';
        dueTone = 'warn';
    } else {
        actionDetail = 'Review account';
        dueText = '';
        dueTone = 'neutral';
    }
    return {
        ...g,
        score,
        reasons,
        oeWindow: win,
        oeDateText,
        wfDoneAll,
        wfTotalAll,
        wfPct,
        wfCount,
        snoozed,
        renewalDays: rd,
        renewalSub,
        transitionStep: transitionStep(g),
        checkInDue,
        checkInText,
        followUpDue,
        followUpText,
        monitorDue,
        actionDetail,
        dueText,
        dueTone,
        cadenceLabel,
        hasTransitionWf,
        hasRenewalWf,
        renewalStartSuggest
    };
}
function statusInfo(s) {
    const m = {
        transition: {
            label: 'In transition',
            color: 'oklch(0.46 0.11 255)'
        },
        active: {
            label: 'Active client',
            color: 'oklch(0.42 0.09 155)'
        },
        onboarding: {
            label: 'Onboarding',
            color: 'oklch(0.5 0.12 200)'
        },
        'open-enrollment': {
            label: 'Open enrollment',
            color: 'oklch(0.55 0.13 65)'
        },
        renewal: {
            label: 'Renewal',
            color: 'oklch(0.58 0.13 75)'
        },
        'at-risk': {
            label: 'At risk',
            color: 'oklch(0.52 0.17 28)'
        },
        parked: {
            label: 'Parked',
            color: '#8a877f'
        }
    };
    return m[s] || m.active;
}
;
}),
"[project]/components/layout/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useGroups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scoring$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/scoring.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function SidebarInner() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { data: groups = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGroups"])();
    const counts = groups.reduce((acc, g)=>{
        const vm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scoring$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["buildVM"])(g);
        if (vm.score > 0 && !vm.snoozed) acc.reach++;
        if (vm.oeWindow === 'now') acc.oeNow++;
        if (vm.oeWindow === 'soon') acc.oe90++;
        if (vm.followUpDue) acc.followUp++;
        if (g.priority) acc.flagged++;
        if (g.status === 'transition') acc.transition++;
        return acc;
    }, {
        reach: 0,
        oeNow: 0,
        oe90: 0,
        followUp: 0,
        flagged: 0,
        transition: 0
    });
    const currentFilter = searchParams.get('filter') ?? '';
    const navItems = [
        {
            label: 'Dashboard',
            href: '/dashboard'
        },
        {
            label: 'All Groups',
            href: '/groups'
        },
        {
            label: 'Workflows',
            href: '/templates'
        }
    ];
    const pipelineItems = [
        {
            label: 'Reach out',
            count: counts.reach,
            filter: 'reachout'
        },
        {
            label: 'On OE now',
            count: counts.oeNow,
            filter: 'oenow'
        },
        {
            label: '90 days out',
            count: counts.oe90,
            filter: 'oe90'
        },
        {
            label: 'Follow-ups',
            count: counts.followUp,
            filter: 'followup'
        },
        {
            label: 'Flagged',
            count: counts.flagged,
            filter: 'priority'
        },
        {
            label: 'In transition',
            count: counts.transition,
            filter: 'transition'
        }
    ];
    function isNavActive(href) {
        if (href === '/dashboard') return pathname === '/dashboard';
        if (href === '/groups') return pathname.startsWith('/groups');
        if (href === '/templates') return pathname.startsWith('/templates');
        return false;
    }
    function isPillActive(filter) {
        return pathname.startsWith('/groups') && currentFilter === filter;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "flex flex-col h-screen overflow-y-auto flex-shrink-0",
        style: {
            width: 238,
            backgroundColor: 'var(--sidebar)',
            color: 'var(--text-sidebar)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pt-6 pb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-lg font-semibold leading-tight",
                        style: {
                            color: '#fff'
                        },
                        children: "Planstin CRM"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs mt-0.5",
                        style: {
                            color: 'rgba(255,255,255,0.5)'
                        },
                        children: "Account Manager"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "px-3 space-y-0.5",
                children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.href,
                        className: [
                            'flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors',
                            isNavActive(item.href) ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/8 hover:text-white'
                        ].join(' '),
                        children: item.label
                    }, item.href, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-4 my-4 border-t border-white/10"
            }, void 0, false, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase",
                        style: {
                            color: 'rgba(255,255,255,0.4)'
                        },
                        children: "Reach Out"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-0.5",
                        children: pipelineItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/groups?filter=${item.filter}`,
                                className: [
                                    'flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-sm transition-colors',
                                    isPillActive(item.filter) ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
                                ].join(' '),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this),
                                    item.count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs px-1.5 py-0.5 rounded-full font-medium",
                                        style: {
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            color: '#fff'
                                        },
                                        children: item.count
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/Sidebar.tsx",
                                        lineNumber: 126,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.filter, true, {
                                fileName: "[project]/components/layout/Sidebar.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Sidebar.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto mx-3 mb-4 px-3 py-3 rounded-lg",
                style: {
                    backgroundColor: 'rgba(255,255,255,0.07)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-xs font-medium",
                    style: {
                        color: 'rgba(255,255,255,0.6)'
                    },
                    children: "Account Manager"
                }, void 0, false, {
                    fileName: "[project]/components/layout/Sidebar.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/Sidebar.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/Sidebar.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
function Sidebar() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "flex flex-col h-screen flex-shrink-0",
            style: {
                width: 238,
                backgroundColor: 'var(--sidebar)'
            }
        }, void 0, false, {
            fileName: "[project]/components/layout/Sidebar.tsx",
            lineNumber: 154,
            columnNumber: 7
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarInner, {}, void 0, false, {
            fileName: "[project]/components/layout/Sidebar.tsx",
            lineNumber: 159,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/Sidebar.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUIStore",
    ()=>useUIStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
'use client';
;
const useUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        search: '',
        setSearch: (s)=>set({
                search: s
            }),
        listFilter: 'all',
        setListFilter: (f)=>set({
                listFilter: f
            }),
        sort: 'priority',
        setSort: (s)=>set({
                sort: s
            }),
        showAddGroup: false,
        setShowAddGroup: (v)=>set({
                showAddGroup: v
            }),
        showSnoozed: false,
        setShowSnoozed: (v)=>set({
                showSnoozed: v
            }),
        expandedNotes: {},
        toggleNoteExpanded: (noteId)=>set((s)=>({
                    expandedNotes: {
                        ...s.expandedNotes,
                        [noteId]: !s.expandedNotes[noteId]
                    }
                })),
        expandedTasks: {},
        toggleTaskExpanded: (taskId)=>set((s)=>({
                    expandedTasks: {
                        ...s.expandedTasks,
                        [taskId]: !s.expandedTasks[taskId]
                    }
                })),
        setTaskExpanded: (taskId, val)=>set((s)=>({
                    expandedTasks: {
                        ...s.expandedTasks,
                        [taskId]: val
                    }
                })),
        collapsedSections: {},
        toggleSection: (key)=>set((s)=>({
                    collapsedSections: {
                        ...s.collapsedSections,
                        [key]: !s.collapsedSections[key]
                    }
                }))
    }));
}),
"[project]/components/layout/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dates.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function getViewInfo(pathname) {
    if (pathname === '/dashboard') return {
        title: 'Dashboard',
        subtitle: 'Overview of your book'
    };
    if (pathname.startsWith('/groups/') && pathname.length > '/groups/'.length) {
        return {
            title: 'Group Detail',
            subtitle: 'Account information'
        };
    }
    if (pathname.startsWith('/groups')) return {
        title: 'All Groups',
        subtitle: 'Your full book of business'
    };
    if (pathname.startsWith('/templates')) return {
        title: 'Workflows',
        subtitle: 'Templates & active workflows'
    };
    return {
        title: 'Planstin CRM',
        subtitle: ''
    };
}
function Header() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { search, setSearch, setShowAddGroup } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUIStore"])();
    const { resolvedTheme, setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const { title, subtitle } = getViewInfo(pathname);
    function handleSearchChange(e) {
        setSearch(e.target.value);
        if (e.target.value && !pathname.startsWith('/groups')) {
            router.push('/groups');
        }
    }
    const todayFormatted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fmt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["todayISO"])());
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-10 flex items-center gap-4 px-6 border-b border-line bg-canvas",
        style: {
            height: 64
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col justify-center min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-ink leading-tight truncate",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-ink-faint leading-tight truncate",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Header.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    placeholder: "Search groups…",
                    value: search,
                    onChange: handleSearchChange,
                    className: "w-full max-w-md px-3 py-1.5 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                }, void 0, false, {
                    fileName: "[project]/components/layout/Header.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/Header.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-ink-faint hidden sm:block whitespace-nowrap",
                        children: todayFormatted
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-ink-faint hover:text-ink hover:bg-canvas-subtle transition-colors text-base",
                        title: "Toggle theme",
                        children: resolvedTheme === 'dark' ? '☀️' : '🌙'
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowAddGroup(true),
                        className: "px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors whitespace-nowrap",
                        children: "+ New group"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Header.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/Header.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/Header.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/Modal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Modal",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function Modal({ open, onClose, title, children }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        const handler = (e)=>{
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return ()=>document.removeEventListener('keydown', handler);
    }, [
        open,
        onClose
    ]);
    if (!open) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        role: "dialog",
        "aria-modal": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/40",
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/components/ui/Modal.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 bg-canvas rounded-2xl border border-line shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-6 py-4 border-b border-line",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-semibold text-ink",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/ui/Modal.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "text-ink-faint hover:text-ink text-lg leading-none",
                                "aria-label": "Close",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/Modal.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/Modal.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4 overflow-y-auto flex-1",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/ui/Modal.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/Modal.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/Modal.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/groups/AddGroupModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddGroupModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useGroups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function AddGroupModal() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { showAddGroup, setShowAddGroup } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUIStore"])();
    const createGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGroups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCreateGroup"])();
    const [groupName, setGroupName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('active');
    const [renewalDate, setRenewalDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [employees, setEmployees] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentBM, setCurrentBM] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    function handleClose() {
        setShowAddGroup(false);
        setGroupName('');
        setStatus('active');
        setRenewalDate('');
        setEmployees('');
        setCurrentBM('');
    }
    async function handleSubmit(e) {
        e.preventDefault();
        if (!groupName.trim()) return;
        const result = await createGroup.mutateAsync({
            groupName: groupName.trim(),
            status,
            renewalDate: renewalDate || undefined,
            employees: employees ? Number(employees) : undefined,
            currentBM: currentBM.trim() || undefined
        });
        handleClose();
        if (result?.id) {
            router.push(`/groups/${result.id}`);
        }
    }
    const statusOptions = [
        {
            value: 'active',
            label: 'Active client'
        },
        {
            value: 'onboarding',
            label: 'Onboarding'
        },
        {
            value: 'transition',
            label: 'In transition'
        },
        {
            value: 'open-enrollment',
            label: 'Open enrollment'
        },
        {
            value: 'renewal',
            label: 'Renewal'
        },
        {
            value: 'at-risk',
            label: 'At risk'
        },
        {
            value: 'parked',
            label: 'Parked'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Modal"], {
        open: showAddGroup,
        onClose: handleClose,
        title: "Add new group",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-ink mb-1",
                            children: [
                                "Group name ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-500",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                                    lineNumber: 62,
                                    columnNumber: 24
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            required: true,
                            value: groupName,
                            onChange: (e)=>setGroupName(e.target.value),
                            placeholder: "Acme Corp",
                            className: "w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-ink mb-1",
                            children: "Status"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: status,
                            onChange: (e)=>setStatus(e.target.value),
                            className: "w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
                            children: statusOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: opt.value,
                                    children: opt.label
                                }, opt.value, false, {
                                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-ink mb-1",
                            children: "Renewal date"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "date",
                            value: renewalDate,
                            onChange: (e)=>setRenewalDate(e.target.value),
                            className: "w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-ink mb-1",
                            children: "Employees"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "number",
                            min: "0",
                            value: employees,
                            onChange: (e)=>setEmployees(e.target.value),
                            placeholder: "0",
                            className: "w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-ink mb-1",
                            children: "Previous BM name"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: currentBM,
                            onChange: (e)=>setCurrentBM(e.target.value),
                            placeholder: "Jane Smith",
                            className: "w-full px-3 py-2 text-sm rounded-lg border border-line bg-canvas-subtle text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-3 pt-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleClose,
                            className: "px-4 py-2 text-sm rounded-lg border border-line text-ink hover:bg-canvas-subtle transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: createGroup.isPending || !groupName.trim(),
                            className: "px-4 py-2 text-sm rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                            children: createGroup.isPending ? 'Creating…' : 'Create group'
                        }, void 0, false, {
                            fileName: "[project]/components/groups/AddGroupModal.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/groups/AddGroupModal.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/groups/AddGroupModal.tsx",
            lineNumber: 59,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/groups/AddGroupModal.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_8dceef32._.js.map