import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Eye, EyeOff } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import bufferboxLogo from "../assets/bufferbox-logo.svg";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, Template, classes, doUseDefaultCss } = props;
    const { realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, social } = kcContext;

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasUsernameError = messagesPerField.existsError("username");
    const hasPasswordError = messagesPerField.existsError("password");
    const usernameErrorMessage = messagesPerField.getFirstError("username");
    const passwordErrorMessage = messagesPerField.getFirstError("password");

    const handleSubmit = () => {
        setIsSubmitting(true);
    };

    // 2 Social Providers (Google & Microsoft) - Always active with fallback
    const effectiveProviders =
        social?.providers && social.providers.length > 0
            ? social.providers
            : [
                  {
                      loginUrl: "#google-login",
                      alias: "google",
                      providerId: "google",
                      displayName: "Google"
                  },
                  {
                      loginUrl: "#microsoft-login",
                      alias: "microsoft",
                      providerId: "microsoft",
                      displayName: "Microsoft"
                  }
              ];

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={null}
            displayMessage={!messagesPerField.existsError("username", "password")}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* BufferBox Logo */}
                <img
                    src={bufferboxLogo}
                    alt="logo"
                    width={90}
                    height={90}
                    className="carbon-logo"
                />

                {/* Title & Subtitle */}
                <h1 className="carbon-title">
                    Welcome back!
                </h1>
                <p className="carbon-subtitle">
                    Log in with your email address
                </p>

                {/* Main Login Form */}
                {realm.password && (
                    <form
                        id="kc-form-login"
                        action={url.loginAction}
                        method="post"
                        onSubmit={handleSubmit}
                        noValidate
                        className="carbon-form"
                    >
                        {/* Email / Username Field */}
                        {!usernameHidden && (
                            <>
                                <label
                                    htmlFor="username"
                                    className="carbon-label"
                                    style={{ marginTop: "32px" }}
                                >
                                    Email
                                </label>
                                <input
                                    tabIndex={1}
                                    id="username"
                                    name="username"
                                    type="email"
                                    autoComplete="email"
                                    defaultValue={login.username ?? ""}
                                    autoFocus
                                    className={`carbon-input ${hasUsernameError ? "carbon-input-error" : ""}`}
                                />
                                {hasUsernameError && (
                                    <p
                                        id="input-error-username"
                                        className="carbon-error-text"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(usernameErrorMessage)
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {/* Password Field */}
                        <label
                            htmlFor="password"
                            className="carbon-label"
                            style={{ marginTop: "20px" }}
                        >
                            Password
                        </label>
                        <div className="carbon-password-wrapper">
                            <input
                                tabIndex={2}
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                className={`carbon-password-input ${hasPasswordError ? "carbon-input-error" : ""}`}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword(prev => !prev)}
                                className="carbon-password-toggle"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff style={{ width: "20px", height: "20px" }} />
                                ) : (
                                    <Eye style={{ width: "20px", height: "20px" }} />
                                )}
                            </button>
                        </div>
                        {hasPasswordError && (
                            <p
                                id="input-error-password"
                                className="carbon-error-text"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(passwordErrorMessage)
                                }}
                            />
                        )}

                        {/* Submit Button */}
                        <input
                            type="hidden"
                            id="id-hidden-input"
                            name="credentialId"
                            value={auth.selectedCredential}
                        />
                        <button
                            tabIndex={3}
                            id="kc-login"
                            name="login"
                            type="submit"
                            disabled={isSubmitting}
                            className="carbon-submit-btn"
                        >
                            {isSubmitting ? "Logging in..." : "Log In"}
                        </button>
                    </form>
                )}

                {/* Two Social Providers (Google & Microsoft) */}
                <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "360px" }}>
                    {/* Divider */}
                    <div className="carbon-social-divider">
                        <div className="carbon-social-divider-line" />
                        <span className="carbon-social-divider-text">
                            or
                        </span>
                        <div className="carbon-social-divider-line" />
                    </div>

                    {/* 2-Column Grid for the Two Social Providers */}
                    <div className="carbon-social-grid">
                        {effectiveProviders.slice(0, 2).map(provider => (
                            <a
                                key={provider.alias}
                                id={`social-${provider.alias}`}
                                href={provider.loginUrl}
                                className="carbon-social-btn"
                            >
                                <SocialIcon providerId={provider.providerId} />
                                <span
                                    style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(provider.displayName)
                                    }}
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Forgot your password? Link */}
                {realm.resetPasswordAllowed && (
                    <a
                        tabIndex={4}
                        href={url.loginResetCredentialsUrl}
                        className="carbon-forgot-link"
                    >
                        Forgot your password?
                    </a>
                )}

                {/* Don't have an account? Register Link */}
                {realm.registrationAllowed && !registrationDisabled && (
                    <div className="carbon-register-row">
                        <span className="carbon-register-label"> Don&apos;t have an account?</span>
                        <a
                            tabIndex={5}
                            href={url.registrationUrl}
                            className="carbon-register-link"
                        >
                            Register
                        </a>
                    </div>
                )}
            </div>
        </Template>
    );
}

/**
 * Brand-accurate SVG logos for social identity providers
 */
function SocialIcon({ providerId }: { providerId: string }) {
    switch (providerId.toLowerCase()) {
        case "google":
            return (
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }} aria-hidden="true">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                </svg>
            );
        case "microsoft":
            return (
                <svg viewBox="0 0 21 21" width="18" height="18" style={{ flexShrink: 0 }} aria-hidden="true">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
            );
        case "github":
            return (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ flexShrink: 0, color: "#1E252F" }} aria-hidden="true">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                </svg>
            );
        case "facebook":
            return (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" style={{ flexShrink: 0 }} aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }} aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                </svg>
            );
    }
}
