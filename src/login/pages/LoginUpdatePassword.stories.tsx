import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import "../main.css";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-password.ftl" });

const meta = {
    title: "login/login-update-password.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithPasswordError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "password",
                    get: (fieldName: string) => (fieldName === "password" ? "Invalid password criteria." : ""),
                    getFirstError: (fieldName: string) => (fieldName === "password" ? "Invalid password criteria." : "")
                }
            }}
        />
    )
};

export const WithConfirmPasswordMismatch: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "password-confirm",
                    get: (fieldName: string) => (fieldName === "password-confirm" ? "Password confirmation does not match." : ""),
                    getFirstError: (fieldName: string) => (fieldName === "password-confirm" ? "Password confirmation does not match." : "")
                }
            }}
        />
    )
};

