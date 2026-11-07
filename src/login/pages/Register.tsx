import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { JSX } from "keycloakify/tools/JSX";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import iconPng from "../assets/icon.png";

export type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields?: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword?: boolean;
};

// Special characters accepted for password validation
const SPECIAL_CHARS = '^$*.[]{}()?"!@#%&/\\,><\':;|_~`+-=';

const hasSpecialChar = (val: string): boolean => {
    for (const c of val) {
        if (SPECIAL_CHARS.includes(c)) return true;
    }
    return false;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, Template, classes, doUseDefaultCss } = props;
    const { url, messagesPerField, recaptchaRequired, recaptchaSiteKey, termsAcceptanceRequired } = kcContext;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    // Live password validation checklist
    const isAtLeast8Chars = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = hasSpecialChar(password);

    const hasEmailError = messagesPerField.existsError("email");
    const hasUsernameError = messagesPerField.existsError("username");
    const hasPasswordError = messagesPerField.existsError("password");
    const hasFirstNameError = messagesPerField.existsError("firstName");
    const hasLastNameError = messagesPerField.existsError("lastName");

    const emailErrorMsg = messagesPerField.getFirstError("email", "username");
    const passwordErrorMsg = messagesPerField.getFirstError("password");
    const firstNameErrorMsg = messagesPerField.getFirstError("firstName");
    const lastNameErrorMsg = messagesPerField.getFirstError("lastName");

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
            displayMessage={messagesPerField.exists("global")}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* BufferBox Logo */}
                <img
                    src={iconPng}
                    alt="AI SaaS Icon"
                    width={120}
                    height={120}
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "18px",
                       // boxShadow: "0 10px 25px -4px rgba(37, 99, 235, 0.35)",
                        userSelect: "none",
                    }}
                />

                {/* Title & Subtitle */}
                <h1 className="title">
                    Register
                </h1>
                <p className="subtitle">
                    Register with your email address
                </p>

                {/* Registration Form */}
                <form
                    id="kc-register-form"
                    action={url.registrationAction}
                    method="post"
                    onSubmit={handleSubmit}
                    noValidate
                    className="form"
                >
                    {/* Hidden Username (auto-matches email for Keycloak) */}
                    <input type="hidden" name="username" value={email} />

                    {/* Hidden Password Confirm (auto-matches password if required) */}
                    <input type="hidden" name="password-confirm" value={password} />

                    {/* Email Field */}
                    <label
                        htmlFor="email"
                        className="label"
                        style={{ marginTop: "32px" }}
                    >
                        Email
                    </label>
                    <input
                        tabIndex={1}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoFocus
                        className={`input ${hasEmailError || hasUsernameError ? "input-error" : ""}`}
                    />
                    {(hasEmailError || hasUsernameError) && (
                        <p
                            id="input-error-email"
                            className="error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(emailErrorMsg)
                            }}
                        />
                    )}

                    {/* Password Field */}
                    <label
                        htmlFor="password"
                        className="label"
                        style={{ marginTop: "20px" }}
                    >
                        Password
                    </label>
                    <div className="password-wrapper">
                        <input
                            tabIndex={2}
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={`password-input ${hasPasswordError ? "input-error" : ""}`}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(prev => !prev)}
                            className="password-toggle"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff style={{ width: "20px", height: "20px" }} />
                            ) : (
                                <Eye style={{ width: "20px", height: "20px" }} />
                            )}
                        </button>
                    </div>

                    {/* Live Password Rules Checklist */}
                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column" }}>
                        <div className={`checklist-item ${isAtLeast8Chars ? "valid" : ""}`}>
                            {isAtLeast8Chars ? (
                                <CheckCircle2 style={{ width: "18px", height: "18px", color: "#12B76A", flexShrink: 0 }} />
                            ) : (
                                <Circle style={{ width: "18px", height: "18px", color: "#D2D8DF", flexShrink: 0 }} />
                            )}
                            <span>Must be at least 8 characters</span>
                        </div>
                        <div className={`checklist-item ${hasLowercase ? "valid" : ""}`}>
                            {hasLowercase ? (
                                <CheckCircle2 style={{ width: "18px", height: "18px", color: "#12B76A", flexShrink: 0 }} />
                            ) : (
                                <Circle style={{ width: "18px", height: "18px", color: "#D2D8DF", flexShrink: 0 }} />
                            )}
                            <span>Minimum one lowercase letter (a-z)</span>
                        </div>
                        <div className={`checklist-item ${hasUppercase ? "valid" : ""}`}>
                            {hasUppercase ? (
                                <CheckCircle2 style={{ width: "18px", height: "18px", color: "#12B76A", flexShrink: 0 }} />
                            ) : (
                                <Circle style={{ width: "18px", height: "18px", color: "#D2D8DF", flexShrink: 0 }} />
                            )}
                            <span>Minimum one uppercase letter (A-Z)</span>
                        </div>
                        <div className={`checklist-item ${hasNumber ? "valid" : ""}`}>
                            {hasNumber ? (
                                <CheckCircle2 style={{ width: "18px", height: "18px", color: "#12B76A", flexShrink: 0 }} />
                            ) : (
                                <Circle style={{ width: "18px", height: "18px", color: "#D2D8DF", flexShrink: 0 }} />
                            )}
                            <span>Minimum one number (0-9)</span>
                        </div>
                        <div className={`checklist-item ${hasSpecial ? "valid" : ""}`}>
                            {hasSpecial ? (
                                <CheckCircle2 style={{ width: "18px", height: "18px", color: "#12B76A", flexShrink: 0 }} />
                            ) : (
                                <Circle style={{ width: "18px", height: "18px", color: "#D2D8DF", flexShrink: 0 }} />
                            )}
                            <span>Minimum one special character</span>
                        </div>
                    </div>

                    {hasPasswordError && (
                        <p
                            id="input-error-password"
                            className="error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(passwordErrorMsg)
                            }}
                        />
                    )}

                    {/* First Name Field */}
                    <label
                        htmlFor="firstName"
                        className="label"
                        style={{ marginTop: "20px" }}
                    >
                        First Name
                    </label>
                    <input
                        tabIndex={3}
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={`input ${hasFirstNameError ? "input-error" : ""}`}
                    />
                    {hasFirstNameError && (
                        <p
                            id="input-error-firstname"
                            className="error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(firstNameErrorMsg)
                            }}
                        />
                    )}

                    {/* Last Name Field */}
                    <label
                        htmlFor="lastName"
                        className="label"
                        style={{ marginTop: "20px" }}
                    >
                        Last Name
                    </label>
                    <input
                        tabIndex={4}
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className={`input ${hasLastNameError ? "input-error" : ""}`}
                    />
                    {hasLastNameError && (
                        <p
                            id="input-error-lastname"
                            className="error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(lastNameErrorMsg)
                            }}
                        />
                    )}

                    {/* Terms Acceptance if required by Keycloak */}
                    {termsAcceptanceRequired && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
                            <input
                                tabIndex={5}
                                id="termsAccepted"
                                name="termsAccepted"
                                type="checkbox"
                                checked={areTermsAccepted}
                                onChange={e => setAreTermsAccepted(e.target.checked)}
                                className="checkbox"
                            />
                            <label htmlFor="termsAccepted" className="label" style={{ fontSize: "13px" }}>
                                I accept the terms of service
                            </label>
                        </div>
                    )}

                    {/* Recaptcha if required by Keycloak */}
                    {recaptchaRequired && recaptchaSiteKey && (
                        <div style={{ marginTop: "20px" }}>
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} />
                        </div>
                    )}

                    {/* Create Account Submit Button */}
                    <button
                        tabIndex={6}
                        id="kc-register"
                        name="register"
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-btn"
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                </form>

                {/* Terms of Use & Privacy Policy Notice */}
                <div className="terms-container">
                    <span style={{ color: "#647081", fontSize: "14px" }}>
                        By clicking Create account, you agree to our
                    </span>
                    <div className="terms-links" style={{ marginTop: "4px" }}>
                        <a
                            href="#terms"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#2563EB", fontWeight: 500, textDecoration: "none" }}
                        >
                            Term of Use and Privacy Policy
                        </a>
                        <span style={{ color: "#647081", margin: "0 4px" }}>&</span>
                        <a
                            href="#privacy"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#2563EB", fontWeight: 500, textDecoration: "none" }}
                        >
                            Privacy Notice
                        </a>
                    </div>
                </div>

                {/* Already have an account? Log In Link */}
                <div className="register-row">
                    <span className="register-label">Already have an account?</span>
                    <a
                        tabIndex={7}
                        href={url.loginUrl}
                        className="register-link"
                    >
                        Log In
                    </a>
                </div>
            </div>
        </Template>
    );
}
