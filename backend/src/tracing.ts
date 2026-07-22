import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import logger from "./utils/logger.utils.js";
import env from "./config/env.config.js";

const enabled = env.OTEL_TRACING_ENABLED;

let sdk: NodeSDK | null = null;

if (enabled) {
  const traceExporter = new OTLPTraceExporter({
    url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
  });

  sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": {
          enabled: false,
        },
      }),
    ],
  });

  try {
    sdk.start();
    logger.info(
      `OpenTelemetry SDK initialized successfully. Exporting traces to ${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    );
  } catch (error) {
    logger.error({ message: "Failed to initialize OpenTelemetry SDK", error });
    sdk = null;
  }
} else {
  logger.info("OpenTelemetry Tracing is disabled (OTEL_TRACING_ENABLED is not set to true).");
}

export async function shutdownTracing(): Promise<void> {
  if (!sdk) return;
  try {
    await sdk.shutdown();
    logger.info("OpenTelemetry SDK shut down successfully.");
  } catch (err) {
    logger.error({ message: "Error shutting down OpenTelemetry SDK", error: err });
  }
}
