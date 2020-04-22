import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";

export default () => {
  Sentry.init({
    dsn:
      "https://f5134ca771054131bf7f79d7385adc93@o307399.ingest.sentry.io/1767607",
    integrations: [new VueIntegration({ Vue, attachProps: true })],
  });
};
