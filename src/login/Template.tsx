import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import signInCover from "./assets/sign-in_100.png";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayMessage = true,
        headerNode,
        socialProvidersNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        children
    } = props;

    const { msg, msgStr } = i18n;
    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.classList.remove("dark");
            document.body.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: "h-full m-0 p-0"
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? "h-full m-0 p-0 font-sans antialiased"
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="split-container">
            {/* Left Panel: Form & Controls (50%) */}
            <div className="split-left-panel">
                {/* Center Content: Form & Elements */}
                <div className="split-center-content">
                    {/* Header node if provided */}
                    {headerNode}

                    {/* Alerts / Error / Success Messages */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div
                            className={clsx(
                                "w-full mb-4 px-3.5 py-3 rounded-xl text-[14px] flex items-start gap-2 shadow-sm border",
                                message.type === "error" && "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400",
                                message.type === "success" && "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400",
                                message.type === "warning" && "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400",
                                message.type === "info" && "bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400"
                            )}
                            role="alert"
                        >
                            <span
                                className="w-full text-center"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(message.summary)
                                }}
                            />
                        </div>
                    )}

                    {children}

                    {/* Try another way link (MFA) */}
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form
                            id="kc-select-try-another-way-form"
                            action={url.loginAction}
                            method="post"
                            className="w-full mt-4 text-center"
                        >
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <a
                                href="#"
                                className="text-[14px] text-[#2563eb] hover:underline"
                                onClick={event => {
                                    document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                    event.preventDefault();
                                    return false;
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </a>
                        </form>
                    )}

                    {socialProvidersNode}
                </div>

                {/* Footer Copyright */}
                <p className="copyright">
                    © Delibix 2026 • AI &amp; Digital Consulting
                </p>
            </div>

            {/* Right Panel: Animated SaaS/IT/AI Visual (50%) - Only Image */}
            <div className="split-right-panel">
                <div className="delibix-animated-cover-wrapper">
                    <img
                        src={signInCover}
                        alt="SaaS IT AI"
                        className="delibix-animated-cover-img"
                        loading="eager"
                    />
                    <div className="delibix-cover-vignette" />
                </div>
            </div>
        </div>
    );
}
