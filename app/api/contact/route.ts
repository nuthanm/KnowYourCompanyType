import { corsPreflightResponse } from "@/lib/api/cors";
import { handleFormSubmit } from "@/lib/api/submit-handler";
import {
  buildContactAdminEmail,
  buildContactUserEmail,
} from "@/lib/email-templates";
import { saveContact } from "@/lib/contact-store";
import { contactSchema } from "@/lib/validators";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  return handleFormSubmit({
    request,
    schema: contactSchema,
    buildAdmin: buildContactAdminEmail,
    buildUser: buildContactUserEmail,
    save: saveContact,
    requireStorage: false,
  });
}
