import { Telegraf } from "telegraf";
import { getAll } from "./commands/get-all";
import { getOne } from "./commands/get-one";
import { create } from "./commands/create";
import { update } from "./commands/update";
import { remove } from "./commands/delete";
import { validate } from "@repo/shared/utils/validate";
import {
  CreateProductSchema,
  ProductParamsSchema,
} from "@repo/shared/schema/product";
import { generateDescription } from "@repo/shared/utils/ai";
import { format } from "./helper/formatter";

const bot = new Telegraf("YOUR_BOT_TOKEN");

bot.start((ctx) => {
  ctx.reply(
    "Welcome to the Product Bot!\n\nCreate a product by only giving a name and our AI provides a description for it.\n\nUse the commands: /products, /product <id>, /create <name>, /update <id> <name>, /delete <id>",
  );
});

bot.command("products", async (ctx) => {
  const response = await getAll();

  if (!response.length) {
    ctx.reply("No products available.");

    return;
  }

  const productsResponses: string[] = [];

  await Promise.all(
    response.map(async (product) => {
      const aiDescription = await generateDescription(product.name);

      productsResponses.push(format(product.id, product.name, aiDescription));
    }),
  );

  ctx.reply(productsResponses.join("\n\n------------\n\n"), {
    parse_mode: "HTML",
  });
});

bot.command("product", async (ctx) => {
  const productId = validate(
    { id: ctx.message.text.split(" ")[1] },
    ProductParamsSchema,
  );

  if (!productId.success) {
    return ctx.reply(productId.error.message);
  }

  const product = await getOne(productId.data.id);
  const aiDescription = await generateDescription(product.name);

  ctx.reply(format(product.id, product.name, aiDescription), {
    parse_mode: "HTML",
  });
});

bot.command("create", async (ctx) => {
  const productName = validate(
    { name: ctx.message.text.split(" ").slice(1).join(" ") },
    CreateProductSchema,
  );

  if (!productName.success) {
    return ctx.reply(productName.error.message);
  }

  const product = await create(productName.data.name);
  const aiDescription = await generateDescription(product.name);

  ctx.reply(format(product.id, product.name, aiDescription), {
    parse_mode: "HTML",
  });
});

bot.command("update", async (ctx) => {
  const args = ctx.message.text.split(" ");

  const productId = validate({ id: args[1] }, ProductParamsSchema);
  const productName = validate(
    { name: args.slice(2).join(" ") },
    CreateProductSchema,
  );

  if (!productId.success) {
    return ctx.reply(productId.error.message);
  }

  if (!productName.success) {
    return ctx.reply(productName.error.message);
  }

  const product = await update(productId.data.id, productName.data.name);
  const aiDescription = await generateDescription(product.name);

  ctx.reply(format(product.id, product.name, aiDescription), {
    parse_mode: "HTML",
  });
});

bot.command("delete", async (ctx) => {
  const productId = validate(
    { id: ctx.message.text.split(" ")[1] },
    ProductParamsSchema,
  );

  if (!productId.success) {
    return ctx.reply(productId.error.message);
  }

  const response = await remove(productId.data.id);

  ctx.reply(`Product <code>${response.id}</code> deleted`, {
    parse_mode: "HTML",
  });
});

bot.launch(() => {
  console.log("Bot started");
});
