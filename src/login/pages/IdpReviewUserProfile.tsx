import { useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { JSX } from "keycloakify/tools/JSX";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import iconPng from "../assets/icon.png";

type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n> & {
    UserProfileFormFields?: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword?: boolean;
};

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, messagesPerField, profile } = kcContext;
    const { msgStr } = i18n;

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
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields={false}
            headerNode={null}
        >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* BufferBox Logo */}
                <img
                    src={iconPng}
                    alt="logo"
                    // width={100}
                    // height={100}
                    style={{ width: "100px", height: "100px", marginBottom: "16px" }}
                    //className="logo"
                />

                {/* Title & Subtitle */}
                <h1 className="title">
                    Update Account Information
                </h1>
                <p className="subtitle">
                    Please enter your first and last name to continue
                </p>
                {userEmail && (
                    <p style={{ marginTop: "4px", fontSize: "14px", fontWeight: 500, color: "#647081" }}>
                        {userEmail}
                    </p>
                )}

                {/* Form: First name and Last name only */}
                <form
                    id="kc-idp-review-profile-form"
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => setIsSubmitting(true)}
                    className="form"
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
                        className="label"
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
                        className={`input ${hasFirstNameError ? "input-error" : ""}`}
                        placeholder="Enter your first name"
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
                        className={`input ${hasLastNameError ? "input-error" : ""}`}
                        placeholder="Enter your last name"
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

                    {/* Submit Button */}
                    <button
                        tabIndex={3}
                        id="kc-submit"
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="submit-btn"
                        style={{ marginTop: "24px" }}
                    >
                        {isSubmitting ? "Saving..." : msgStr("doSubmit")}
                    </button>
                </form>
            </div>
        </Template>
    );
}
