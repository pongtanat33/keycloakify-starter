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
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: "h-full bg-white m-0 p-0"
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? "h-full bg-white m-0 p-0 font-sans antialiased text-[#050C17]"
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="split-container">
            {/* ฝั่งซ้าย (Left Side): 50% ของหน้าจอ */}
            <div className="split-left-panel">
                {/* เนื้อหาตรงกลาง: Form & Elements */}
                <div className="split-center-content">
                    {/* Header node if provided */}
                    {headerNode}

                    {/* Alerts / Error / Success Messages */}
                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div
                            className={clsx(
                                "w-full mb-4 px-3.5 py-2.5 rounded-md text-[14px] flex items-start gap-2",
                                message.type === "error" && "bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318]",
                                message.type === "success" && "bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48]",
                                message.type === "warning" && "bg-[#FFFAEB] border border-[#FEDF89] text-[#B54708]",
                                message.type === "info" && "bg-[#F0F6FF] border border-[#C2DAFF] text-[#164C9A]"
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
                                className="text-[14px] text-[#164C9A] hover:underline"
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
                <p className="carbon-copyright">
                    ©BufferBox 2024
                </p>
            </div>

            {/* ฝั่งขวา (Right Side): 50% ของหน้าจอ ภาพ Cover Image */}
            <div className="split-right-panel">
                <img
                    src={signInCover}
                    alt="sign-in-cover"
                    loading="eager"
                />
            </div>
        </div>
    );
}
