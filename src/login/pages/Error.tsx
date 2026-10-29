import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { ArrowLeft } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import warningIcon from "../assets/warning.png";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client, skipLink, url } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={null}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", textAlign: "center" }}>
                {/* Warning Icon (56x56) */}
                <img
                    src={warningIcon}
                    alt="error"
                    width={56}
                    height={56}
                    style={{ width: "56px", height: "56px", userSelect: "none" }}
                />

                {/* Title */}
                <h1 className="carbon-title" style={{ marginTop: "24px" }}>
                    {msg("errorTitle")}
                </h1>

                {/* Error Summary Message */}
                <div style={{ marginTop: "16px", maxWidth: "360px" }}>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "#647081",
                            lineHeight: 1.5,
                            margin: 0,
                            wordBreak: "break-word"
                        }}
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(message.summary)
                        }}
                    />
                </div>

                {/* Primary Button: Restart login / Sign in again */}
                <a
                    tabIndex={1}
                    href={url.loginRestartFlowUrl || url.loginUrl}
                    className="carbon-submit-btn"
                    style={{
                        marginTop: "28px",
                        width: "100%",
                        maxWidth: "360px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none"
                    }}
                >
                    Back to log in
                </a>

                {/* Secondary Link: Back to Application (if available) */}
                {!skipLink && !!client?.baseUrl && (
                    <a
                        tabIndex={2}
                        id="backToApplication"
                        href={client.baseUrl}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            marginTop: "16px",
                            color: "#164C9A",
                            fontWeight: 500,
                            fontSize: "14px",
                            textDecoration: "none"
                        }}
                        onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                    >
                        <ArrowLeft style={{ width: "18px", height: "18px" }} />
                        <span>{msg("backToApplication")}</span>
                    </a>
                )}
            </div>
        </Template>
    );
}

