import config from "../config";

export async function invokeApig({
  path,
  method = "GET",
  headers = {},
  body = undefined
}) {
  const endPoint = config.apiGateway.URL
  const version = config.apiGateway.VERSION

  const requestParams = {
    method: method,
    url: endPoint + version + path,
    headers: headers,
    body: body
  };

  const results = await fetch(requestParams.url, {
    method,
    headers,
    body
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
}