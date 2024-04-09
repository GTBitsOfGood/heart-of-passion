import { z } from "zod";

// Define Zod schema for the nested values array
const FormsiteValueSchema = z.object({
  other: z.string().optional(),
  position: z.number(),
  value: z.string(),
});

// Define Zod schema for the items array
const FormsiteItemSchema = z.object({
  id: z.string(),
  position: z.number(),
  value: z.string().optional(),
  values: z.array(FormsiteValueSchema).optional(),
});

// Define Zod schema for the FormsiteResult
const FormsiteResultSchema = z.object({
  date_finish: z.string(),
  date_start: z.string(),
  date_update: z.string(),
  id: z.string(),
  items: z.array(FormsiteItemSchema),
});

// Define Zod schema for the array of FormsiteResult
const FormsiteResultsSchema = z.array(FormsiteResultSchema);

export type FormsiteResult = z.infer<typeof FormsiteResultSchema>;

class FormsiteAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private getHeader() {
    return {
      Authorization: `bearer ${this.apiKey}`,
      Accept: "application/json",
    };
  }

  public async getRecentSubmissions(
    limit: number = 100,
    page: number = 1,
  ): Promise<FormsiteResult[]> {
    const url = `${this.baseUrl}/results?limit=${limit}&page=${page}`;
    const options = {
      method: "GET",
      headers: this.getHeader(),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return FormsiteResultsSchema.parse(data.results);
  }
}

const FORMSITE_BASE_URL =
  "https://fs19.formsite.com/api/v2/HeartofPassion/forms/Donate";

const formsiteClient = new FormsiteAPI(
  process.env.FORMSITE_API_KEY || "",
  FORMSITE_BASE_URL,
);

export default formsiteClient;
