
export interface VerifiedJwt {
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  sub: string;
  oid?: string;
  unique_name?: string;
  roles?: string[];
}