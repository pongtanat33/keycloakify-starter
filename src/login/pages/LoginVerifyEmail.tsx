import type { PageProps } from "keycloakify/login/pages/PageProps";
import { ArrowLeft } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import emailDoneIcon from "../assets/email-done.png";

export default function LoginVerifyEmail(
    props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template, classes, doUseDefaultCss } = props;
    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayInfo={false}
            displayMessage={false}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", textAlign: "center" }}>
                {/* Email Done Icon (56x56) */}
                <img
                    src={emailDoneIcon}
                    alt="check-email"
                    width={56}
                    height={56}
                    style={{ width: "56px", height: "56px", userSelect: "none" }}
                />

                {/* Title */}
                <h1
                    className="title"
                    style={{
                        marginTop: "24px",
                        textAlign: "center",
                        lineHeight: 1.3
                    }}
                >
                    Please check your email
                    <br />
                    to verify your account
                </h1>

                {/* Subtitle & Email */}
                <p
                    className="subtitle"
                    style={{
                        marginTop: "12px",
                        textAlign: "center"
                    }}
                >
                    We have sent a verification link to
                </p>
                {user?.email && (
                    <p
                        style={{
                            marginTop: "4px",
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "#050C17",
                            wordBreak: "break-all"
                        }}
                    >
                        {user.email}
                    </p>
                )}

                {/* Resend Verification Link Button */}
                <a
                    tabIndex={1}
                    href={url.loginAction}
                    className="submit-btn"
                    style={{
                        marginTop: "32px",
                        width: "100%",
                        maxWidth: "360px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none"
                    }}
                >
                    Resend verification link
                </a>

                {/* Back to Log In Link */}
                <a
                    tabIndex={2}
                    href={url.loginRestartFlowUrl || url.loginUrl}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        marginTop: "24px",
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

