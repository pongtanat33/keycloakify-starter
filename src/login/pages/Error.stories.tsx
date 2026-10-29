import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import "../main.css";

const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" });

const meta = {
    title: "login/error.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "You are already authenticated as different user 'pongtanat.pan@pea.co.th' in this session. Please sign out first.",
                    type: "error"
                }
            }}
        />
    )
};

export const WithDifferentUserSession: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "You are already authenticated as different user 'pongtanat.pan@pea.co.th' in this session. Please sign out first.",
                    type: "error"
                },
                client: {
                    baseUrl: "https://carbonform.bufferbox.co"
                }
            }}
        />
    )
};

export const GeneralError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    summary: "An error occurred while processing your request. Please try again later.",
                    type: "error"
                }
            }}
        />
    )
};

