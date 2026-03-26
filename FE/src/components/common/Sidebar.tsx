import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Menu, Gamepad2, Plus, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import type { SidebarProps } from "../../types/Layout.types";

export function Sidebar({
    currentUserName,
    currentUserRole,
    currentPage,
    sidebarCollapsed,
    currentUserAvatar,
    setSidebarCollapsed,
    onNavigate,
    navigationItems,
}: SidebarProps) {
    const navigate = useNavigate();
    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

    return (
        <>
            {!sidebarCollapsed && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setSidebarCollapsed(true)}
                    aria-hidden="true"
                />
            )}

            <div
                className={`bg-slate-900 text-slate-100 shadow-xl transition-all duration-300 ${
                    sidebarCollapsed
                        ? "w-0 -translate-x-full overflow-hidden pointer-events-none opacity-0 md:opacity-100 md:pointer-events-auto md:translate-x-0 md:w-16 md:overflow-visible lg:w-16"
                        : "w-64 md:w-64 lg:w-64 opacity-100"
                } flex flex-col h-screen fixed left-0 top-0 z-50 md:z-40 lg:z-40`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-700 shrink-0">
                    {!sidebarCollapsed && (
                        <div
                            className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                            onClick={() => navigate("/")}
                        >
                            <div className="p-1.5 sm:p-2 bg-violet-600/20 rounded-lg">
                                <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
                            </div>
                            <span className="font-bold text-sm sm:text-base text-slate-50">
                                {currentUserRole === "Admin" ? "Admin" : "Manager"}
                            </span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-1.5 sm:p-2 text-slate-200 hover:text-slate-50 hover:bg-slate-800"
                    >
                        {sidebarCollapsed ? (
                            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
                    {navigationItems &&
                        navigationItems.map((item) => {
                            const isActive =
                                currentPage === item.id ||
                                (item.id === "user-management" && currentPage === "add-user");
                            const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;
                            const isDropdownOpen = openDropdowns.has(item.id);

                            return (
                                <div
                                    key={item.id}
                                    className="space-y-1"
                                    onMouseEnter={() => {
                                        if (hasDropdown && !sidebarCollapsed) {
                                            setOpenDropdowns((prev) => {
                                                const newSet = new Set(prev);
                                                newSet.add(item.id);
                                                return newSet;
                                            });
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (hasDropdown && !sidebarCollapsed) {
                                            setOpenDropdowns((prev) => {
                                                const newSet = new Set(prev);
                                                newSet.delete(item.id);
                                                return newSet;
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex items-stretch gap-1">
                                        <div className="relative flex-1">
                                            <Button
                                                variant={isActive ? "default" : "ghost"}
                                                className={`flex w-full items-center justify-start px-2 sm:px-3 py-1.5 sm:py-2 ${
                                                    sidebarCollapsed ? "px-1.5 sm:px-2" : ""
                                                } ${
                                                    isActive
                                                        ? "bg-violet-600 text-white hover:bg-violet-700"
                                                        : "text-slate-200 hover:bg-slate-800"
                                                } rounded-md text-sm sm:text-base`}
                                                onClick={() => {
                                                    if (item.path) {
                                                        navigate(item.path);
                                                    } else {
                                                        onNavigate(item.id);
                                                    }
                                                    if (window.innerWidth < 768) {
                                                        setSidebarCollapsed(true);
                                                    }
                                                }}
                                            >
                                                <item.icon
                                                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                                        sidebarCollapsed ? "" : "mr-2 sm:mr-3"
                                                    } ${isActive ? "text-white" : "text-slate-400"}`}
                                                />
                                                {!sidebarCollapsed && (
                                                    <>
                                                        <span className="flex-1 text-left text-sm sm:text-base">
                                                            {item.label}
                                                        </span>
                                                        {item.badgeCount !== undefined &&
                                                            item.badgeCount !== null &&
                                                            item.badgeCount > 0 && (
                                                                <span className="ml-auto inline-flex min-w-[18px] sm:min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-black">
                                                                    {item.badgeCount > 9
                                                                        ? "9+"
                                                                        : item.badgeCount}
                                                                </span>
                                                            )}
                                                    </>
                                                )}
                                            </Button>
                                            {sidebarCollapsed &&
                                                item.badgeCount !== undefined &&
                                                item.badgeCount !== null &&
                                                item.badgeCount > 0 && (
                                                    <span className="pointer-events-none absolute -top-1 -right-1 inline-flex h-3.5 sm:h-4 min-w-[14px] sm:min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-0.5 sm:px-1 text-[9px] sm:text-[10px] font-semibold text-black">
                                                        {item.badgeCount > 9 ? "9+" : item.badgeCount}
                                                    </span>
                                                )}
                                        </div>
                                        {hasDropdown && !sidebarCollapsed && (
                                            <Button
                                                variant={isActive ? "default" : "ghost"}
                                                className={`px-2 sm:px-2.5 py-1.5 sm:py-2 min-w-[36px] sm:min-w-[40px] flex items-center justify-center transition-all pointer-events-none ${
                                                    isActive
                                                        ? "bg-violet-700 text-white rounded-md"
                                                        : "text-slate-300 rounded-md"
                                                }`}
                                            >
                                                <ChevronDown
                                                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 ${
                                                        isDropdownOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Dropdown Items */}
                                    {hasDropdown && !sidebarCollapsed && isDropdownOpen && (
                                        <div className="ml-3 sm:ml-4 space-y-1 border-l-2 border-slate-700 pl-2">
                                            {item.dropdownItems?.map((dropdownItem) => (
                                                <Button
                                                    key={dropdownItem.id}
                                                    variant="ghost"
                                                    className="w-full justify-start px-2 sm:px-3 py-1.5 sm:py-2 h-auto text-xs sm:text-sm text-slate-200 hover:bg-slate-800 hover:text-white"
                                                    onClick={() => {
                                                        dropdownItem.onClick();
                                                        setOpenDropdowns((prev) => {
                                                            const newSet = new Set(prev);
                                                            newSet.delete(item.id);
                                                            return newSet;
                                                        });
                                                        if (window.innerWidth < 768) {
                                                            setSidebarCollapsed(true);
                                                        }
                                                    }}
                                                >
                                                    {dropdownItem.icon && (
                                                        <dropdownItem.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-slate-400" />
                                                    )}
                                                    {!dropdownItem.icon && (
                                                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-slate-400" />
                                                    )}
                                                    <span className="flex-1 text-left">
                                                        {dropdownItem.label}
                                                    </span>
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </nav>

                {/* User info */}
                <div className="p-3 sm:p-4 border-t border-slate-700 space-y-2 sm:space-y-3 shrink-0">
                    {!sidebarCollapsed && (
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 overflow-hidden bg-slate-800">
                                <img
                                    src={currentUserAvatar || "https://github.com/shadcn.png"}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://github.com/shadcn.png";
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-slate-50 truncate">
                                    {currentUserName}
                                </p>
                                <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                                    {currentUserRole}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

