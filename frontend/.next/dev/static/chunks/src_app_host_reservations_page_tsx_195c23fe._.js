(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/host/reservations/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HostReservationPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function HostReservationPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [reservations, setReservations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [hostUser, setHostUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 백엔드 API 주소
    const API_URL = "http://localhost:3001/api/reservations";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HostReservationPage.useEffect": ()=>{
            // 1. 로그인 및 권한 체크
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                alert("로그인이 필요합니다.");
                router.push("/auth/login");
                return;
            }
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== "HOST") {
                alert("호스트만 접근할 수 있습니다.");
                router.push("/");
                return;
            }
            setHostUser(parsedUser);
            // 2. 예약 목록 로드 시작
            fetchReservations(parsedUser.id);
        }
    }["HostReservationPage.useEffect"], [
        router
    ]);
    // 예약 목록 조회 함수
    const fetchReservations = async (hostId)=>{
        setLoading(true);
        try {
            // 🚨 [핵심] 새로 구현한 호스트용 API 호출: GET /api/reservations/host/:hostId
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/host/${hostId}`);
            setReservations(response.data);
        } catch (err) {
            console.error("예약 목록 로딩 실패:", err);
            setError(`예약 정보를 불러오는데 실패했습니다. (Error: ${err.response?.status || err.message})`);
        } finally{
            setLoading(false);
        }
    };
    // 예약 상태 변경 핸들러 (승인 또는 거절) - PATCH API가 구현되었다고 가정
    const handleUpdateStatus = async (reservationId, newStatus)=>{
        const action = newStatus === "CONFIRMED" ? "승인" : "거절";
        if (!confirm(`예약을 ${action}하시겠습니까?`)) return;
        try {
            // PATCH /api/reservations/:id/status API 호출 (추후 구현 예정)
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`${API_URL}/${reservationId}/status`, {
                status: newStatus,
                hostId: hostUser?.id
            });
            alert(`예약이 성공적으로 ${action}되었습니다.`);
            // 상태 업데이트 후 목록 새로고침
            if (hostUser) fetchReservations(hostUser.id);
        } catch (err) {
            console.error(`${action} 실패:`, err);
            alert(`예약 ${action} 처리에 실패했습니다. (오류: ${err.response?.data?.message || err.message})`);
        }
    };
    // 상태에 따른 배지 스타일링
    const getStatusBadge = (status)=>{
        let colorClass = "";
        let statusText = "";
        switch(status){
            case "PENDING":
                colorClass = "bg-yellow-100 text-yellow-800";
                statusText = "대기 중";
                break;
            case "CONFIRMED":
                colorClass = "bg-green-100 text-green-800";
                statusText = "예약 확정";
                break;
            case "CANCELLED":
                colorClass = "bg-red-100 text-red-800";
                statusText = "예약 취소";
                break;
            default:
                colorClass = "bg-gray-100 text-gray-800";
                statusText = "알 수 없음";
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: `inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`,
            children: statusText
        }, void 0, false, {
            fileName: "[project]/src/app/host/reservations/page.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this);
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-center py-20",
        children: "예약 목록을 불러오는 중..."
    }, void 0, false, {
        fileName: "[project]/src/app/host/reservations/page.tsx",
        lineNumber: 136,
        columnNumber: 23
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-center py-20 text-red-500 font-bold",
        children: [
            "오류: ",
            error
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/host/reservations/page.tsx",
        lineNumber: 137,
        columnNumber: 21
    }, this);
    if (!hostUser) return null; // 로딩 중 권한 없는 경우
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-7xl mx-auto p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-8 text-gray-800",
                children: [
                    "카라반 예약 관리 대시보드 (",
                    hostUser.name,
                    "님)"
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/host/reservations/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            reservations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-20 bg-gray-50 rounded-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 text-lg",
                        children: "내 카라반에 들어온 예약 요청이 없습니다."
                    }, void 0, false, {
                        fileName: "[project]/src/app/host/reservations/page.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-400 mt-2",
                        children: "새로운 예약 요청이 들어오면 여기에 표시됩니다."
                    }, void 0, false, {
                        fileName: "[project]/src/app/host/reservations/page.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/host/reservations/page.tsx",
                lineNumber: 147,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: reservations.map((reservation)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center hover:shadow-lg transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 space-y-2 lg:space-y-0 lg:flex lg:space-x-8 items-center w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "lg:w-32 flex-shrink-0 mb-3 lg:mb-0",
                                        children: getStatusBadge(reservation.status)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/host/reservations/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-semibold text-gray-800 truncate",
                                                children: reservation.caravan.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-gray-700",
                                                        children: "게스트:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/host/reservations/page.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    reservation.guest?.name || "익명",
                                                    " (",
                                                    reservation.guest?.email,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                                lineNumber: 169,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-gray-700",
                                                        children: "기간:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/host/reservations/page.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    new Date(reservation.startDate).toLocaleDateString(),
                                                    " ~ ",
                                                    new Date(reservation.endDate).toLocaleDateString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/host/reservations/page.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "lg:w-40 flex-shrink-0 text-left lg:text-right mt-3 lg:mt-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-500",
                                                children: "총 금액"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                                lineNumber: 179,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xl font-bold text-green-600",
                                                children: [
                                                    "₩",
                                                    reservation.totalPrice.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                                lineNumber: 180,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/host/reservations/page.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                lineNumber: 159,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-5 lg:mt-0 flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0 flex-shrink-0",
                                children: reservation.status === "PENDING" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleUpdateStatus(reservation.id, "CONFIRMED"),
                                            className: "bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition w-full lg:w-auto",
                                            children: "예약 승인"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/host/reservations/page.tsx",
                                            lineNumber: 188,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleUpdateStatus(reservation.id, "CANCELLED"),
                                            className: "bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition w-full lg:w-auto",
                                            children: "예약 거절"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/host/reservations/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: true,
                                    className: "bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed w-full lg:w-auto",
                                    children: "처리 완료"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/host/reservations/page.tsx",
                                    lineNumber: 202,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/host/reservations/page.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this)
                        ]
                    }, reservation.id, true, {
                        fileName: "[project]/src/app/host/reservations/page.tsx",
                        lineNumber: 154,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/host/reservations/page.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/host/reservations/page.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s(HostReservationPage, "op+EaNnvcGCqJZJ9utbb00mD0Lo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = HostReservationPage;
var _c;
__turbopack_context__.k.register(_c, "HostReservationPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_host_reservations_page_tsx_195c23fe._.js.map