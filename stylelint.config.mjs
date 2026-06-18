import sharedConfig from "stylelint-config-nick2bad4u";

/** @type {import("stylelint").Config} */
const stylelintConfig = {
    ...sharedConfig,
    overrides: [
        ...(sharedConfig.overrides ?? []),
        {
            files: ["docs/docusaurus/src/**/*.css"],
            rules: {
                "css-performance-budget/no-global-expensive-effects": null,
                "css-performance-budget/no-heavy-selectors": null,
                "css-performance-budget/no-paint-heavy-declarations": null,
                "css-performance-budget/require-reduced-motion-for-expensive-animations":
                    null,
                "defensive-css/require-named-grid-lines": null,
                "grid/prefer-minmax-zero-fr": null,
                "order/properties-order": null,
                "scales/font-sizes": null,
                "scales/line-heights": null,
                "scss/declaration-property-value-no-unknown": null,
            },
        },
    ],
};

export default stylelintConfig;
