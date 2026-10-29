import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import "../main.css";

const { KcPageStory } = createKcPageStory({ pageId: "idp-review-user-profile.ftl" });

const meta = {
    title: "login/idp-review-user-profile.ftl",
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
                        email: { value: "user@gmail.com" }
                    }
                }
            }}
        />
    )
};

export const WithPrefilledData: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                profile: {
                    attributesByName: {
                        firstName: { value: "Pongtanat" },
                        lastName: { value: "S." },
                        email: { value: "pongtanat@gmail.com" }
                    }
                }
            }}
        />
    )
};

export const WithLastNameError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                profile: {
                    attributesByName: {
                        firstName: { value: "Pongtanat" },
                        lastName: { value: "" },
                        email: { value: "pongtanat@gmail.com" }
                    }
                },
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "lastName",
                    get: () => "Last name is required.",
                    getFirstError: () => "Last name is required."
                }
            }}
        />
    )
};
