import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import "../main.css";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-profile.ftl" });

const meta = {
    title: "login/login-update-profile.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                profile: {
                    attributesByName: {
                        firstName: { value: "" },
                        lastName: { value: "" },
                        email: { value: "user@bufferbox.co" }
                    }
                }
            }}
        />
    )
};

export const WithPrefilledNames: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                profile: {
                    attributesByName: {
                        firstName: { value: "Pongtanat" },
                        lastName: { value: "Buffer" },
                        email: { value: "pongtanat@bufferbox.co" }
                    }
                }
            }}
        />
    )
};

export const WithFirstNameError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                profile: {
                    attributesByName: {
                        firstName: { value: "" },
                        lastName: { value: "Buffer" },
                        email: { value: "pongtanat@bufferbox.co" }
                    }
                },
                messagesPerField: {
                    existsError: (field: string) => field === "firstName",
                    get: () => "First name is required",
                    getFirstError: () => "First name is required"
                }
            }}
        />
    )
};
