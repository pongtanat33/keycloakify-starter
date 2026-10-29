import type { PageProps } from "keycloakify/login/pages/PageProps";
import { ArrowLeft } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import warningIcon from "../assets/warning.png";

export default function LoginPageExpired(
    props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;

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
                    alt="page-expired"
                    width={56}
                    height={56}
                    style={{ width: "56px", height: "56px", userSelect: "none" }}
                />

                {/* Title */}
                <h1 className="carbon-title" style={{ marginTop: "24px" }}>
                    Page expired
                </h1>

                {/* Subtitle */}
                <p className="carbon-subtitle" style={{ marginTop: "12px", textAlign: "center", maxWidth: "360px" }}>
                    Your login attempt timed out. Please restart the login process to continue.
                </p>

                {/* Restart Log In Button */}
                <a
                    tabIndex={1}
                    href={url.loginRestartFlowUrl}
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
                    Restart log in
                </a>

                {/* Back to log in link */}
                <a
                    tabIndex={2}
                    href={url.loginAction || url.loginRestartFlowUrl}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "20px",
                        color: "#164C9A",
                        fontWeight: 500,
                        fontSize: "14px",
                        textDecoration: "none"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                >
                    <ArrowLeft style={{ width: "18px", height: "18px" }} />
                    <span>Back to log in</span>
                </a>
            </div>
        </Template>
    );
}

