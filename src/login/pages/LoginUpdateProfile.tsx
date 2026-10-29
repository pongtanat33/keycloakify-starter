import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { JSX } from "keycloakify/tools/JSX";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import bufferboxLogo from "../assets/bufferbox-logo.svg";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
    UserProfileFormFields?: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword?: boolean;
};

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { messagesPerField, url, isAppInitiatedAction, profile } = kcContext;
    const { msg, msgStr } = i18n;

    const initialFirstName = profile?.attributesByName?.firstName?.value ?? "";
    const initialLastName = profile?.attributesByName?.lastName?.value ?? "";
    const userEmail = profile?.attributesByName?.email?.value ?? "";

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasFirstNameError = messagesPerField.existsError("firstName");
    const firstNameErrorMsg = messagesPerField.getFirstError("firstName");

    const hasLastNameError = messagesPerField.existsError("lastName");
    const lastNameErrorMsg = messagesPerField.getFirstError("lastName");

    const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayRequiredFields={false}
            headerNode={null}
            displayMessage={messagesPerField.exists("global")}
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
                    Update Account Information
                </h1>
                <p className="carbon-subtitle">
                    Please enter your first and last name to continue
                </p>
                {userEmail && (
                    <p style={{ marginTop: "4px", fontSize: "14px", fontWeight: 500, color: "#647081" }}>
                        {userEmail}
                    </p>
                )}

                {/* Form: First name and Last name only */}
                <form
                    id="kc-update-profile-form"
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => setIsSubmitting(true)}
                    className="carbon-form"
                    style={{ marginTop: "16px" }}
                >
                    {/* Preserve other attributes (e.g. email, username) as hidden inputs */}
                    {Object.entries(profile?.attributesByName ?? {}).map(([name, attr]) => {
                        if (name === "firstName" || name === "lastName") {
                            return null;
                        }
                        return (
                            <input
                                key={name}
                                type="hidden"
                                name={name}
                                value={attr.value ?? ""}
                            />
                        );
                    })}

                    {/* Fallback username if missing and email exists */}
                    {!profile?.attributesByName?.username?.value && userEmail && (
                        <input type="hidden" name="username" value={userEmail} />
                    )}

                    {/* First Name Field */}
                    <label
                        htmlFor="firstName"
                        className="carbon-label"
                        style={{ marginTop: "16px" }}
                    >
                        First name
                    </label>
                    <input
                        tabIndex={1}
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoFocus
                        required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={`carbon-input ${hasFirstNameError ? "carbon-input-error" : ""}`}
                        placeholder="Enter your first name"
                    />
                    {hasFirstNameError && (
                        <p
                            id="input-error-firstname"
                            className="carbon-error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(firstNameErrorMsg)
                            }}
                        />
                    )}

                    {/* Last Name Field */}
                    <label
                        htmlFor="lastName"
                        className="carbon-label"
                        style={{ marginTop: "16px" }}
                    >
                        Last name
                    </label>
                    <input
                        tabIndex={2}
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className={`carbon-input ${hasLastNameError ? "carbon-input-error" : ""}`}
                        placeholder="Enter your last name"
                    />
                    {hasLastNameError && (
                        <p
                            id="input-error-lastname"
                            className="carbon-error-text"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(lastNameErrorMsg)
                            }}
                        />
                    )}

                    {/* Submit Button */}
                    <button
                        tabIndex={3}
                        id="kc-submit"
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="carbon-submit-btn"
                        style={{ marginTop: "24px" }}
                    >
                        {isSubmitting ? "Saving..." : msgStr("doSubmit")}
                    </button>

                    {isAppInitiatedAction && (
                        <button
                            tabIndex={4}
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            formNoValidate
                            style={{
                                marginTop: "12px",
                                width: "100%",
                                height: "40px",
                                background: "transparent",
                                border: "1px solid #d2d8df",
                                borderRadius: "6px",
                                color: "#374151",
                                fontWeight: 500,
                                fontSize: "14px",
                                cursor: "pointer"
                            }}
                        >
                            {msg("doCancel")}
                        </button>
                    )}
                </form>
            </div>
        </Template>
    );
}
