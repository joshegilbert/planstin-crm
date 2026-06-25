module.exports = [
"[project]/.next-internal/server/app/api/templates/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServerClient",
    ()=>createServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
function createServerClient() {
    const url = ("TURBOPACK compile-time value", "https://pbtyfrsvfdwznlgslqvl.supabase.co");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, key, {
        auth: {
            persistSession: false
        }
    });
}
}),
"[project]/lib/db-transforms.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "groupPatchToDb",
    ()=>groupPatchToDb,
    "reconstructWorkflows",
    ()=>reconstructWorkflows,
    "taskPatchToDb",
    ()=>taskPatchToDb,
    "transformGroup",
    ()=>transformGroup,
    "transformNote",
    ()=>transformNote,
    "transformTask",
    ()=>transformTask,
    "transformTemplate",
    ()=>transformTemplate
]);
function transformGroup(row) {
    return {
        id: row.id,
        groupName: row.group_name,
        currentBM: row.current_bm || '',
        renewalMonth: row.renewal_month || '',
        renewalDate: row.renewal_date || null,
        status: row.status,
        priority: row.priority ?? false,
        fullOwnership: row.full_ownership || null,
        commissionEffective: row.commission_effective || null,
        transitionTimeline: row.transition_timeline || '',
        warmHandoff: row.warm_handoff ?? false,
        warmHandoffDate: row.warm_handoff_date || null,
        newContact: row.new_contact ?? false,
        ownershipTaken: row.ownership_taken ?? false,
        sfUpdated: row.sf_updated ?? false,
        changeCompleted: row.change_completed ?? false,
        introEmailDate: row.intro_email_date || null,
        employees: row.employees ?? null,
        activeOnPlans: row.active_on_plans ?? null,
        fte: row.fte ?? null,
        state: row.state || '',
        agent: row.agent || '',
        contributions: row.contributions || '',
        participation: row.participation || '',
        planRichness: row.plan_richness || '',
        claimsFund: row.claims_fund || '',
        plans: row.plans || '',
        platform: row.platform || '',
        plansOffered: row.plans_offered || [],
        contactName: row.contact_name || '',
        contactEmail: row.contact_email || '',
        contactPhone: row.contact_phone || '',
        gcRole: row.gc_role || '',
        salesforceLink: row.salesforce_link || '',
        cadence: row.cadence || '',
        customCadenceDays: row.custom_cadence_days ?? null,
        lastCheckIn: row.last_check_in || null,
        nextCheckIn: row.next_check_in || null,
        followUpDate: row.follow_up_date || null,
        followUpNote: row.follow_up_note || '',
        oeMode: row.oe_mode || 'undecided',
        oeStartDate: row.oe_start_date || null,
        oeEndDate: row.oe_end_date || null,
        asaSigned: row.asa_signed ?? false,
        oeDecisionNote: row.oe_decision_note || '',
        nhoStatus: row.nho_status || '',
        nhoNote: row.nho_note || '',
        watchOuts: row.watch_outs || '',
        monitorMonthly: row.monitor_monthly ?? false,
        lastMonitor: row.last_monitor || null,
        snoozedUntil: row.snoozed_until || null
    };
}
function transformNote(row) {
    return {
        id: row.id,
        groupId: row.group_id,
        type: row.type,
        text: row.text,
        date: row.date,
        createdAt: row.created_at
    };
}
function transformTask(row) {
    return {
        id: row.id,
        workflowId: row.workflow_id,
        sectionName: row.section_name,
        sectionOrder: row.section_order,
        taskOrder: row.task_order,
        label: row.label,
        offsetDays: row.offset_days ?? null,
        dueDate: row.due_date || null,
        assignedDate: row.assigned_date || null,
        completedDate: row.completed_date || null,
        reminderDate: row.reminder_date || null,
        note: row.note || ''
    };
}
function reconstructWorkflows(workflows, tasks) {
    return workflows.map((wf)=>{
        const wfTasks = tasks.filter((t)=>t.workflow_id === wf.id);
        const sectionMap = new Map();
        for (const task of wfTasks){
            if (!sectionMap.has(task.section_order)) {
                sectionMap.set(task.section_order, {
                    name: task.section_name,
                    tasks: []
                });
            }
            sectionMap.get(task.section_order).tasks.push(transformTask(task));
        }
        const sections = Array.from(sectionMap.entries()).sort(([a], [b])=>a - b).map(([, sec])=>({
                name: sec.name,
                tasks: sec.tasks.sort((a, b)=>a.taskOrder - b.taskOrder)
            }));
        return {
            id: wf.id,
            groupId: wf.group_id,
            templateId: wf.template_id || null,
            type: wf.type,
            title: wf.title,
            startedDate: wf.started_date,
            sections
        };
    });
}
function transformTemplate(row) {
    return {
        id: row.id,
        type: row.type,
        title: row.title,
        builtin: row.builtin ?? false,
        anchor: row.anchor || null,
        autoStartDays: row.auto_start_days ?? null,
        sections: row.sections || []
    };
}
function groupPatchToDb(patch) {
    const map = {
        groupName: 'group_name',
        currentBM: 'current_bm',
        renewalMonth: 'renewal_month',
        renewalDate: 'renewal_date',
        status: 'status',
        priority: 'priority',
        fullOwnership: 'full_ownership',
        commissionEffective: 'commission_effective',
        transitionTimeline: 'transition_timeline',
        warmHandoff: 'warm_handoff',
        warmHandoffDate: 'warm_handoff_date',
        newContact: 'new_contact',
        ownershipTaken: 'ownership_taken',
        sfUpdated: 'sf_updated',
        changeCompleted: 'change_completed',
        introEmailDate: 'intro_email_date',
        employees: 'employees',
        activeOnPlans: 'active_on_plans',
        fte: 'fte',
        state: 'state',
        agent: 'agent',
        contributions: 'contributions',
        participation: 'participation',
        planRichness: 'plan_richness',
        claimsFund: 'claims_fund',
        plans: 'plans',
        platform: 'platform',
        plansOffered: 'plans_offered',
        contactName: 'contact_name',
        contactEmail: 'contact_email',
        contactPhone: 'contact_phone',
        gcRole: 'gc_role',
        salesforceLink: 'salesforce_link',
        cadence: 'cadence',
        customCadenceDays: 'custom_cadence_days',
        lastCheckIn: 'last_check_in',
        nextCheckIn: 'next_check_in',
        followUpDate: 'follow_up_date',
        followUpNote: 'follow_up_note',
        oeMode: 'oe_mode',
        oeStartDate: 'oe_start_date',
        oeEndDate: 'oe_end_date',
        asaSigned: 'asa_signed',
        oeDecisionNote: 'oe_decision_note',
        nhoStatus: 'nho_status',
        nhoNote: 'nho_note',
        watchOuts: 'watch_outs',
        monitorMonthly: 'monitor_monthly',
        lastMonitor: 'last_monitor',
        snoozedUntil: 'snoozed_until'
    };
    const result = {};
    for (const [key, val] of Object.entries(patch)){
        const dbKey = map[key];
        if (dbKey) result[dbKey] = val;
    }
    return result;
}
function taskPatchToDb(patch) {
    const map = {
        label: 'label',
        dueDate: 'due_date',
        assignedDate: 'assigned_date',
        completedDate: 'completed_date',
        reminderDate: 'reminder_date',
        note: 'note',
        sectionName: 'section_name',
        taskOrder: 'task_order'
    };
    const result = {};
    for (const [key, val] of Object.entries(patch)){
        const dbKey = map[key];
        if (dbKey) result[dbKey] = val;
    }
    return result;
}
}),
"[project]/constants/workflow-templates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/app/api/templates/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$transforms$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db-transforms.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$workflow$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/workflow-templates.ts [app-route] (ecmascript)");
;
;
;
;
async function GET() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
    const { data, error } = await supabase.from('workflow_templates').select('*').order('builtin', {
        ascending: false
    }).order('title');
    if (error) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: error.message
    }, {
        status: 500
    });
    // If no templates in DB, return defaults
    if (!data || data.length === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$workflow$2d$templates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_WORKFLOW_TEMPLATES"]);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$transforms$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transformTemplate"]));
}
async function POST(req) {
    const body = await req.json();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
    const id = 'tpl_custom_' + Date.now();
    const { data, error } = await supabase.from('workflow_templates').insert({
        id,
        type: 'custom',
        title: body.title || 'New workflow',
        builtin: false,
        anchor: null,
        auto_start_days: null,
        sections: body.sections || [
            {
                name: 'Tasks',
                tasks: []
            }
        ]
    }).select().single();
    if (error) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: error.message
    }, {
        status: 500
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2d$transforms$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transformTemplate"])(data), {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e7be65f4._.js.map