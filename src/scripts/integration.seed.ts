import { connectDB } from "../config/db";
import { Integration } from "../models/Integration";
import integrationData from "../data/integration.data.json";
async function seedIntegrations() {
  try {
    await connectDB();
    await Integration.create(integrationData);
    console.log("✅ Integrations seeded");
  } catch (error) {
    console.error("❌ Error seeding integrations:", error);
  }
}

seedIntegrations();
