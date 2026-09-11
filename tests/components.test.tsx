import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { act, type ReactNode } from "react";
import type { Root } from "react-dom/client";
import { Showcase } from "../src/Showcase.tsx";
import { Button } from "../src/components/Button.tsx";
import { Input } from "../src/components/Input.tsx";
import { Card } from "../src/components/Card.tsx";
import { Stack } from "../src/components/Stack.tsx";
import { buttonContract, stackContract } from "../src/components/contract.ts";

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, MutationObserver: dom.window.MutationObserver, IS_REACT_ACT_ENVIRONMENT: true });
const { createRoot } = await import("react-dom/client");
let root: Root | undefined;
let container: HTMLDivElement;
async function render(node: ReactNode) {
  if (!root) { container = document.createElement('div'); document.body.append(container); root = createRoot(container); }
  await act(async () => { root!.render(node); });
  return container;
}
afterEach(async () => { if (root) await act(async () => root!.unmount()); root = undefined; document.body.innerHTML = ''; });

test('Button supports contract variants/sizes, rejects invented options and styling', async () => {
  for (const variant of buttonContract.variants) for (const size of buttonContract.api.size.values) {
    const node = await render(<Button variant={variant} size={size}>Create project</Button>);
    const button = node.querySelector('button')!;
    assert.equal(button.dataset.variant, variant); assert.equal(button.dataset.size, size); assert.equal(button.type, 'button');
  }
  await assert.rejects(render(<Button {...{variant:'invented'} as any}>Bad</Button>), /unsupported variant/);
  await assert.rejects(render(<Button {...{style:{color:'red'}} as any}>Bad</Button>), /unsupported prop style/);
});

test('Button loading preserves name and focus, blocks callbacks and native submission; disabled is native', async () => {
  let clicks=0, submits=0;
  const tree=(loading=false, disabled=false)=><form onSubmit={e=>{e.preventDefault();submits++;}}><Button type="submit" loading={loading} disabled={disabled} onClick={()=>clicks++}>Create project</Button></form>;
  await render(tree()); const button=container.querySelector('button')!;
  button.focus(); await render(tree(true));
  assert.equal(document.activeElement, button); assert.equal(button.disabled,false);
  assert.equal(button.textContent,'Create project'); assert.equal(button.getAttribute('aria-busy'),'true');
  const indicator=button.querySelector('svg.forma-button-loader')!;
  assert.ok(indicator); assert.equal(indicator.hasAttribute('value'),false);
  assert.equal(indicator.getAttribute('aria-hidden'),'true'); assert.equal(indicator.getAttribute('focusable'),'false');
  await act(async()=>{button.click();button.click();});
  assert.equal(clicks,0);assert.equal(submits,0);
  await render(tree(false)); assert.equal(button.querySelector('svg.forma-button-loader'),indicator); assert.equal(button.getAttribute('aria-busy'),null); await act(async()=>button.click());assert.equal(clicks,1);assert.equal(submits,1);
  await render(tree(false,true)); assert.equal(button.disabled,true);
  await act(async()=>button.click());assert.equal(clicks,1);assert.equal(submits,1);
});

test('icon-only Button requires a nonempty accessible name',async()=>{
  await assert.rejects(render(<Button iconOnly aria-label=" ">+</Button>),/accessible name/);
  await render(<Button iconOnly aria-label="Add project"><span aria-hidden="true">+</span></Button>);
  assert.equal(container.querySelector('button')!.getAttribute('aria-label'),'Add project');
});

test('Input associates visible labels, help/error text and exposes native disabled/required/invalid',async()=>{
  await render(<><Input label="Project name" helperText="Use a recognizable name" errorMessage="Enter a name" required disabled /><Input label="Other name" /></>);
  const [input, other]=container.querySelectorAll('input');
  assert.notEqual(input.id,other.id);assert.ok(input.id);
  assert.equal(container.querySelector('label')!.htmlFor,input.id);
  for(const id of input.getAttribute('aria-describedby')!.split(' '))assert.ok(document.getElementById(id)?.textContent);
  assert.equal(input.getAttribute('aria-invalid'),'true');assert.equal(input.disabled,true);assert.equal(input.required,true);
  await render(<Input label="Project" invalid helperText=" " errorMessage=" " />);
  assert.equal(container.querySelector('input')!.getAttribute('aria-invalid'),'true');assert.equal(container.querySelector('input')!.getAttribute('aria-describedby'),null);
});

test('Input rejects missing labels and invalid controlled APIs',async()=>{
  await assert.rejects(render(<Input label=" " placeholder="Name" />),/visible label/);
  await assert.rejects(render(<Input {...{label:'Name',value:'x'} as any} />),/controlled value/);
  await assert.rejects(render(<Input {...{label:'Name',type:'date'} as any} />),/unsupported type/);
});

test('Card keeps native static/link semantics and rejects nested interactive descendants',async()=>{
  await render(<Card><Button>Action</Button></Card>);assert.equal(container.firstElementChild!.tagName,'DIV');
  await render(<Card mode="link" href="#project">Project</Card>);assert.equal(container.firstElementChild!.tagName,'A');
  assert.equal(container.querySelector('a')!.getAttribute('href'),'#project');
  await assert.rejects(render(<Card mode="link" href="">Project</Card>),/requires href/);
  await assert.rejects(render(<Card mode="link" href="#project"><span><button>Nested</button></span></Card>),/interactive descendants/);
  await assert.rejects(render(<Card mode="link" href="#project"><Button>Nested component</Button></Card>),/interactive descendants/);
});

test('Stack only accepts governed gaps, maps flex controls and preserves order',async()=>{
  for(const gap of stackContract.api.gap.values){
    await render(<Stack gap={gap} direction="horizontal" align="center" justify="between" wrap><span>One</span><span>Two</span></Stack>);
    const stack=container.firstElementChild as HTMLElement;
    assert.equal(stack.style.getPropertyValue('--gap'),`var(--forma-${gap.replace('.','-')})`);
    assert.equal(stack.dataset.direction,'horizontal');assert.equal(stack.dataset.wrap,'true');
    assert.equal(stack.textContent,'OneTwo');
  }
  await assert.rejects(render(<Stack {...{gap:'13px'} as any}>Bad</Stack>),/unsupported gap/);
});


test('showcase project creation validates name/URL and retains a local loading/completion flow', async () => {
  await render(<Showcase />);
  const form=container.querySelector('form')!;
  const name=container.querySelector('#create-project-name') as HTMLInputElement;
  const url=container.querySelector('#create-project-url') as HTMLInputElement;
  const submit=form.querySelector('button[type="submit"]') as HTMLButtonElement;
  await act(async()=>submit.click());
  assert.equal(document.activeElement,name); assert.equal(name.getAttribute('aria-invalid'),'true');
  const setValue=Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value')!.set!;
  async function fill(input: HTMLInputElement,value: string){
    await act(async()=>{setValue.call(input,value);input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
  }
  await fill(name,'Accessibility review');await fill(url,'not-a-url');
  await act(async()=>submit.click());assert.equal(document.activeElement,url);assert.equal(url.getAttribute('aria-invalid'),'true');
  await fill(url,'https://example.com/brief');
  await act(async()=>submit.click());
  assert.equal(submit.getAttribute('aria-busy'),'true');assert.equal(name.disabled,true);assert.equal(url.disabled,true);
  assert.ok(form.querySelector('.forma-card')!.textContent!.includes('Design Operations'));
  await act(async()=>{await new Promise(resolve=>setTimeout(resolve,1300));});
  assert.match(form.querySelector('[role="status"]')!.textContent!,/Accessibility review.*created in Design Operations/);
  assert.equal(submit.getAttribute('aria-busy'),null);
  await act(async()=>{(Array.from(form.querySelectorAll('button')).find(b=>b.textContent==='Clear form')!).click();});
  assert.equal(name.value,'');assert.equal(url.value,'');
});
