import { useState, useCallback, useEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import resetPasswordIcon from "../assets/reset-password.png";
import checkIcon from "../assets/check.png";
import uncheckedIcon from "../assets/unchecked.png";

const FIREBASE_SPECIAL_CHARS = '^$*.[]{}()?"!@#%&/\\,><\':;|_~`';
const hasSpecialChar = (val: string): boolean => {
    for (const c of val) {
        if (FIREBASE_SPECIAL_CHARS.includes(c)) return true;
    }
    return false;
};

export default function LoginUpdatePassword(
    props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>
) {
    const { kcContext, i18n, Template, classes, doUseDefaultCss } = props;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation criteria
    const [contains8C, setContains8C] = useState(false);
    const [containsLL, setContainsLL] = useState(false);
    const [containsUL, setContainsUL] = useState(false);
    const [containsN, setContainsN] = useState(false);
    const [containsSC, setContainsSC] = useState(false);

    const validatePassword = useCallback(() => {
        setContains8C(password.length >= 8);
        setContainsLL(password.toUpperCase() !== password);
        setContainsUL(password.toLowerCase() !== password);
        setContainsN(/\d/.test(password));
        setContainsSC(hasSpecialChar(password));
    }, [password]);

    useEffect(() => {
        validatePassword();
    }, [validatePassword]);

    const hasPasswordError =
        messagesPerField.existsError("password", "password-new");
    const passwordErrorMessage =
        messagesPerField.getFirstError("password", "password-new");

    const hasConfirmPasswordError =
        messagesPerField.existsError("password-confirm");
    const confirmPasswordErrorMessage =
        messagesPerField.getFirstError("password-confirm");

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
            displayMessage={
                !messagesPerField.existsError("password", "password-new", "password-confirm")
            }
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* Reset Password Icon (56x56) */}
                <img
                    src={resetPasswordIcon}
                    alt="reset-password"
                    width={56}
                    height={56}
                    style={{ width: "56px", height: "56px", userSelect: "none" }}
                />

                {/* Title */}
                <h1 className="carbon-title" style={{ marginTop: "24px" }}>
                    Set New Password
                </h1>

                {/* Subtitle */}
                <p className="carbon-subtitle" style={{ marginTop: "12px", textAlign: "center", maxWidth: "360px" }}>
                    Your new password must be different from previously used passwords.
                </p>

                {/* Form */}
                <form
                    id="kc-passwd-update-form"
                    action={url.loginAction}
                    method="post"
                    onSubmit={handleSubmit}
                    noValidate
                    className="carbon-form"
                >
                    {/* New Password */}
                    <label
                        htmlFor="password-new"
                        className="carbon-label"
                        style={{ marginTop: "24px" }}
                    >
                        New Password
                    </label>
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            tabIndex={1}
                            id="password-new"
                            name="password-new"
                            type={showPassword ? "text" : "password"}
                            autoFocus
                            autoComplete="new-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={`carbon-input ${hasPasswordError ? "carbon-input-error" : ""}`}
                            style={{ paddingRight: "44px" }}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                padding: 0
                            }}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

                    {/* Password Criteria Checklist */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                                src={contains8C ? checkIcon : uncheckedIcon}
                                alt=""
                                width={20}
                                height={20}
                                style={{ width: "20px", height: "20px" }}
                            />
                            <span style={{ fontSize: "14px", color: contains8C ? "#10B981" : "#647081", fontWeight: 500 }}>
                                Must be at least 8 characters
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                                src={containsLL ? checkIcon : uncheckedIcon}
                                alt=""
                                width={20}
                                height={20}
                                style={{ width: "20px", height: "20px" }}
                            />
                            <span style={{ fontSize: "14px", color: containsLL ? "#10B981" : "#647081", fontWeight: 500 }}>
                                Minimum one lowercase letter (a-z)
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                                src={containsUL ? checkIcon : uncheckedIcon}
                                alt=""
                                width={20}
                                height={20}
                                style={{ width: "20px", height: "20px" }}
                            />
                            <span style={{ fontSize: "14px", color: containsUL ? "#10B981" : "#647081", fontWeight: 500 }}>
                                Minimum one uppercase letter (A-Z)
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                                src={containsN ? checkIcon : uncheckedIcon}
                                alt=""
                                width={20}
                                height={20}
                                style={{ width: "20px", height: "20px" }}
                            />
                            <span style={{ fontSize: "14px", color: containsN ? "#10B981" : "#647081", fontWeight: 500 }}>
                                Minimum one number (0-9)
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <img
                                src={containsSC ? checkIcon : uncheckedIcon}
                                alt=""
                                width={20}
                                height={20}
                                style={{ width: "20px", height: "20px" }}
                            />
                            <span style={{ fontSize: "14px", color: containsSC ? "#10B981" : "#647081", fontWeight: 500 }}>
                                Minimum one special character
                            </span>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <label
                        htmlFor="password-confirm"
                        className="carbon-label"
                        style={{ marginTop: "20px" }}
                    >
                        Confirm new password
                    </label>
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            tabIndex={2}
                            id="password-confirm"
                            name="password-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className={`carbon-input ${hasConfirmPasswordError ? "carbon-input-error" : ""}`}
                            style={{ paddingRight: "44px" }}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                padding: 0
                            }}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {hasConfirmPasswordError && (
                        <p
                            id="input-error-password-confirm"
                            className="carbon-error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(confirmPasswordErrorMessage)
                            }}
                        />
                    )}

                    {/* Submit Button */}
                    <button
                        tabIndex={3}
                        id="kc-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="carbon-submit-btn"
                        style={{ marginTop: "24px" }}
                    >
                        {isSubmitting ? "Setting New Password..." : "Set New Password"}
                    </button>

                    {isAppInitiatedAction && (
                        <button
                            tabIndex={4}
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            style={{
                                marginTop: "12px",
                                width: "100%",
                                height: "44px",
                                background: "transparent",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                color: "#374151",
                                fontWeight: 500,
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </form>

                {/* Back to Log In */}
                <a
                    tabIndex={5}
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

