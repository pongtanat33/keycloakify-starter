import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { ArrowLeft } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import forgetPasswordIcon from "../assets/forget-password.png";

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template, classes, doUseDefaultCss } = props;
    const { url, realm, auth, messagesPerField } = kcContext;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasUsernameError = messagesPerField.existsError("username");
    const usernameErrorMessage = messagesPerField.getFirstError("username");

    const handleSubmit = () => {
        setIsSubmitting(true);
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={!messagesPerField.existsError("username")}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* Forget Password Icon (56x56) */}
                <img
                    src={forgetPasswordIcon}
                    alt="forget-password"
                    width={56}
                    height={56}
                    style={{ width: "56px", height: "56px", userSelect: "none" }}
                />

                {/* Title */}
                <h1 className="title" style={{ marginTop: "24px" }}>
                    Forgot password?
                </h1>

                {/* Subtitle */}
                <p className="subtitle" style={{ marginTop: "12px", textAlign: "center", maxWidth: "360px" }}>
                    No worries, Enter your email and we'll send an email with instructions to reset your password.
                </p>

                {/* Reset Password Form */}
                <form
                    id="kc-reset-password-form"
                    action={url.loginAction}
                    method="post"
                    onSubmit={handleSubmit}
                    noValidate
                    className="form"
                >
                    {/* Email / Username Field */}
                    <label
                        htmlFor="username"
                        className="label"
                        style={{ marginTop: "32px" }}
                    >
                        {!realm.loginWithEmailAllowed
                            ? "Username"
                            : !realm.registrationEmailAsUsername
                                ? "Username or email"
                                : "Email"}
                    </label>
                    <input
                        tabIndex={1}
                        id="username"
                        name="username"
                        type="text"
                        autoFocus
                        defaultValue={auth.attemptedUsername ?? ""}
                        autoComplete="username"
                        className={`input ${hasUsernameError ? "input-error" : ""}`}
                    />
                    {hasUsernameError && (
                        <p
                            id="input-error-username"
                            className="error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(usernameErrorMessage)
                            }}
                        />
                    )}

                    {/* Submit Button */}
                    <button
                        tabIndex={2}
                        id="kc-submit"
                        name="submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-btn"
                        style={{ marginTop: "24px" }}
                    >
                        {isSubmitting ? "Sending..." : "Send Instructions"}
                    </button>
                </form>

                {/* Back to Log In Link */}
                <a
                    tabIndex={3}
                    href={url.loginUrl}
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

