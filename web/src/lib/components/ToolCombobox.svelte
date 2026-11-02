<script lang="ts">
	import miseTools from '#lib/mise-tools.json';
	import { searchTools, type Tool } from '#lib/tool-search.js';

	interface Props {
		value: string;
		/** Called after a suggestion was picked; typing fires the usual input event. */
		onpick: () => void;
	}

	let { value = $bindable(), onpick }: Props = $props();

	const id = $props.id();
	let open = $state(false);
	let active = $state(0);
	let list: HTMLUListElement | undefined = $state();

	const hits = $derived(searchTools(miseTools as Tool[], value));
	// nothing to suggest once the name is exactly a tool
	const shown = $derived(open && hits.length > 0 && !(hits.length === 1 && hits[0].name === value.trim()));

	function pick(tool: Tool) {
		value = tool.name;
		open = false;
		onpick();
	}

	function move(by: number) {
		open = true;
		active = (active + by + hits.length) % hits.length;
		list?.children[active]?.scrollIntoView({ block: 'nearest' });
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && hits.length) {
			event.preventDefault();
			move(open ? 1 : 0);
		} else if (event.key === 'ArrowUp' && hits.length) {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Enter' && shown) {
			event.preventDefault();
			pick(hits[active]);
		} else if (event.key === 'Escape' && shown) {
			event.preventDefault();
			open = false;
		}
	}
</script>

<div class="combo">
	<input
		bind:value
		oninput={() => ((open = true), (active = 0))}
		onfocus={() => (open = true)}
		onblur={() => (open = false)}
		onkeydown={keydown}
		role="combobox"
		aria-expanded={shown}
		aria-controls="{id}-list"
		aria-autocomplete="list"
		aria-activedescendant={shown ? `${id}-${active}` : undefined}
		placeholder="e.g. java, terraform, npm:prettier"
		aria-label="Tool"
		autocomplete="off"
		spellcheck="false"
	/>
	{#if shown}
		<ul id="{id}-list" role="listbox" bind:this={list}>
			{#each hits as tool, i (tool.name)}
				<!-- mousedown keeps the focus in the input; keyboard users pick with the arrows and Enter -->
				<li
					id="{id}-{i}"
					role="option"
					aria-selected={i === active}
					class:active={i === active}
					onmousedown={(event) => (event.preventDefault(), pick(tool))}
					onmousemove={() => (active = i)}
				>
					<span class="name">{tool.name}</span>
					{#if tool.description}<span class="description">{tool.description}</span>{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.combo {
		position: relative;
	}
	input {
		width: 100%;
	}
	ul {
		position: absolute;
		z-index: 20;
		top: calc(100% + 0.25rem);
		left: 0;
		right: 0;
		max-height: 20rem;
		overflow-y: auto;
		margin: 0;
		padding: 0.25rem;
		list-style: none;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
	}
	li {
		display: grid;
		gap: 0.1rem;
		padding: 0.4rem 0.55rem;
		border-radius: calc(var(--radius) - 4px);
		cursor: pointer;
	}
	li.active {
		background: var(--accent-soft);
	}
	.name {
		font-family: var(--mono);
		font-weight: 600;
	}
	.description {
		color: var(--muted);
		font-size: 0.82rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
