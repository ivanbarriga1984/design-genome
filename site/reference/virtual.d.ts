declare module "virtual:forma-reference" {
  const data: import("./projection").ReferenceData;
  export default data;
}

declare module "virtual:forma-workshop" {
  const data: import("../workshop/projection").WorkshopData;
  export default data;
}
