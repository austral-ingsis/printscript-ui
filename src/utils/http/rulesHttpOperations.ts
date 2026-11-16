import {AxiosInstance} from "axios";
import {Rule} from "../../types/Rule.ts";

export type RuleType = "lint" | "format"

export class RulesHttpOperations {
  constructor(private readonly http: AxiosInstance) {}

  async get(type: RuleType): Promise<Rule[]> {
    const {data} = await this.http.get<Rule[]>(`/rules/${type}`)
    return data
  }

  async update(type: RuleType, rules: Rule[]): Promise<Rule[]> {
    const {data} = await this.http.put<Rule[]>(`/rules/${type}`, rules)
    return data
  }
}
