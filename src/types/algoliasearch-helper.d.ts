declare module 'algoliasearch-helper' {
  import { EventEmitter } from 'events';
  import algoliasearch from 'algoliasearch';

  namespace algoliasearchHelper {
    interface FacetRefinement {
      value: string;
      type: 'conjunctive' | 'disjunctive' | 'exclude';
    }

    interface NumericRefinement {
      value: Array<number>;
      operator: string;
      type: 'numeric';
    }

    interface FacetSearchResult {
      facetHits: FacetSearchHit;
      processingTimeMS: number;
    }

    interface FacetSearchHit {
      value: string;
      highlighted: string;
      count: number;
      isRefined: boolean;
    }

    interface Facet {
      name: string;
      data: object;
      stats: object;
    }

    interface FacetValue {
      name: string;
      count: number;
      isRefined: boolean;
      isExcluded: boolean;
    }

    interface HierarchicalFacet {
      name: string;
      count: number;
      path: string;
      isRefined: boolean;
      data: Array<HierarchicalFacet>;
    }

    type RefinementType =
      | 'numeric'
      | 'facet'
      | 'exclude'
      | 'disjunctive'
      | 'hierarchical';

    interface Refinement {
      type: RefinementType;
      attributeName: string;
      name: string;
      numericValue: number;
      operator: string;
      count: number;
      exhaustive: boolean;
    }

    type clearCallback = (
      value: OperatorList | FacetList,
      key: string,
      type:
        | 'numeric'
        | 'disjunctiveFacet'
        | 'conjunctiveFacet'
        | 'hierarchicalFacet'
        | 'exclude'
    ) => boolean;

    type FacetList = Array<string>;

    type Operator = '=' | '>' | '>=' | '<' | '<=' | '!=';

    type OperatorList = { [K in Operator]?: Array<number | Array<number>> };

    type SearchResultsOpts = {
      sortBy: Array<string> | (() => any);
    };

    interface SearchResults<Hit> {
      hits: Array<Hit>;
      getFacetValues(
        attribute: string,
        opts: SearchResultsOpts
      ): Array<FacetValue> | HierarchicalFacet;
      getFacetStats(attribute: string): object;
      getRefinements(): Array<Refinement>;
      aroundLatLng: string;
      automaticRadius: string;
      hitsPerPage: number;
      nbHits: number;
      nbPages: number;
      index: string;
      query: string;
      page: number;
      parsedQuery: string;
      userData: Array<object>;
      processingTimeMS: number;
      serverUsed: string;
      exhaustiveFacetsCount: boolean;
      exhaustiveNbHits: boolean;
    }

    type SearchOnceResult<Hit> = {
      content: SearchResults<Hit>;
      state: SearchParameters;
    };

    interface SearchParametersAttributes {
      query: string;
      disjunctiveFacets?: Array<string>;
      disjunctiveFacetsRefinements?: { string: FacetList };
      facets?: Array<string>;
      facetsExcludes?: { string: FacetList };
      facetsRefinements?: { string: FacetList };
      hierarchicalFacets?: Array<string> | Array<object>;
      hierarchicalFacetsRefinements?: { string: FacetList };
      numericRefinements?: { string: OperatorList };
      tagRefinements?: Array<string>;
    }

    interface SearchParameters extends SearchParametersAttributes {
      addDisjunctiveFacet(facet: string): SearchParameters;
      addDisjunctiveFacetRefinement(
        facet: string,
        value: string
      ): SearchParameters;
      addExcludeRefinement(facet: string, value: string): SearchParameters;
      addFacet(facet: string): SearchParameters;
      addFacetRefinement(facet: string, value: string): SearchParameters;
      addHierarchicalFacet(hierarchicalFacet: object): SearchParameters;
      addHierarchicalFacetRefinement(
        facet: string,
        path: string
      ): SearchParameters;
      addNumericRefinement(
        attribute: string,
        operator: Operator,
        value: string
      ): SearchParameters;
      addTagRefinement(tag: string): SearchParameters;
      clearRefinements(attribute: string): SearchParameters;
      clearTags(): SearchParameters;
      filter(filters: Array<string>): object;
      getConjunctiveRefinements(facetName: string): Array<string>;
      getDisjunctiveRefinements(facetName: string): Array<string>;
      getExcludeRefinements(facetName: string): Array<string>;
      getHierarchicalFacetBreadcrumb(facetName: string): Array<string>;
      getHierarchicalFacetByName(hierarchicalFacetName: string): object;
      getHierarchicalRefinement(facetName: string): Array<string>;
      getNumericRefinements(facetName: string): Array<OperatorList>;
      getNumericRefinement(
        attribute: string,
        operator: Operator
      ): Array<number | Array<number>>;
      getQueryParameter(paramName: string): any;
      getRefinedDisjunctiveFacets(facet: string, value: string): Array<string>;
      getRefinedHierarchicalFacets(facet: string, value: string): Array<string>;
      getUnrefinedDisjunctiveFacets(): Array<string>;
      isConjunctiveFacet(facet: string): boolean;
      isDisjunctiveFacetRefined(facet: string, value: string): boolean;
      isDisjunctiveFacet(facet: string): boolean;
      isExcludeRefined(facet: string, value: string): boolean;
      isFacetRefined(facet: string, value: string): boolean;
      isHierarchicalFacetRefined(facet: string, value: string): boolean;
      isHierarchicalFacet(facetName: string): boolean;
      isNumericRefined(
        attribute: string,
        operator: Operator,
        value: string
      ): boolean;
      isTagRefined(tag: string): boolean;
      make(
        newParameters: SearchParametersAttributes | SearchParameters
      ): SearchParameters;
      removeExcludeRefinement(facet: string, value: string): SearchParameters;
      removeFacet(facet: string): SearchParameters;
      removeFacetRefinement(facet: string, value: string): SearchParameters;
      removeDisjunctiveFacet(facet: string): SearchParameters;
      removeDisjunctiveFacetRefinement(
        facet: string,
        value: string
      ): SearchParameters;
      removeHierarchicalFacet(facet: string): SearchParameters;
      removeHierarchicalFacetRefinement(facet: string): SearchParameters;
      removeTagRefinement(tag: string): SearchParameters;
      setDisjunctiveFacets(facets: Array<string>): SearchParameters;
      setFacets(facets: Array<string>): SearchParameters;
      setHitsPerPage(n: number): SearchParameters;
      setPage(newPage: number): SearchParameters;
      setQueryParameters(params: object): SearchParameters;
      setQueryParameter(parameter: string, value: string): SearchParameters;
      setQuery(newQuery: string): SearchParameters;
      setTypoTolerance(
        typoTolerance: 'true' | 'false' | 'min' | 'strict'
      ): SearchParameters;
      toggleDisjunctiveFacetRefinement(
        facet: string,
        value: string
      ): SearchParameters;
      toggleExcludeFacetRefinement(
        facet: string,
        value: string
      ): SearchParameters;
      toggleConjunctiveFacetRefinement(
        facet: string,
        value: string
      ): SearchParameters;
      toggleHierarchicalFacetRefinement(
        facet: string,
        value: string
      ): SearchParameters;
      toggleFacetRefinement(facet: string, value: string): SearchParameters;
      toggleTagRefinement(tag: string): SearchParameters;
      validate(
        currentState: SearchParametersAttributes,
        parameters: SearchParametersAttributes | SearchParameters
      ): Error | null;
    }

    type SearchOptions = SearchParametersAttributes | SearchParameters;

    export class AlgoliaSearchHelper<Hit> extends EventEmitter {
      search(): this;
      searchOnce(options?: SearchOptions): Promise<SearchOnceResult<Hit>>;
      searchForFacetValues(
        facet: string,
        query: string,
        maxFacetHits?: number,
        userState?: SearchOptions
      ): Promise<FacetSearchResult>;
      hasPendingRequests(): boolean;
      clearCache(): this;
      derive(fn: (parms: SearchParameters) => SearchParameters): EventEmitter;
      setQuery(query: string): AlgoliaSearchHelper<Hit>;
      setIndex(name: string): AlgoliaSearchHelper<Hit>;
      getIndex(): string;
      setPage(page: number): AlgoliaSearchHelper<Hit>;
      nextPage(): AlgoliaSearchHelper<Hit>;
      previousPage(): AlgoliaSearchHelper<Hit>;
      getPage(): number;
      setQueryParameter(
        parameter: string,
        value: any
      ): AlgoliaSearchHelper<Hit>;
      getQueryParameter(parameterName: string): any;
      clearRefinements(name: string): AlgoliaSearchHelper<Hit>;
      addFacetRefinement(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      removeFacetRefinement(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      toggleFacetRefinement(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      hasRefinements(attribute: string): boolean;
      getRefinements(
        facetName: string
      ): (FacetRefinement | NumericRefinement)[];
      clearRefinements(name: string): AlgoliaSearchHelper<Hit>;
      addDisjunctiveFacetRefinement(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      removeDisjunctiveFacetRefinement(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      hasRefinements(attribute: string): boolean;
      addHierarchicalFacetRefinement(
        facet: string,
        path: string
      ): AlgoliaSearchHelper<Hit>;
      getHierarchicalFacetBreadcrumb(facetName: string): Array<string>;
      removeHierarchicalFacetRefinement(
        facet: string
      ): AlgoliaSearchHelper<Hit>;
      toggleFacetRefinement(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      addFacetExclusion(facet: string, value: string): AlgoliaSearchHelper<Hit>;
      removeFacetExclusion(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      toggleFacetExclusion(
        facet: string,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      hasRefinements(attribute: string): boolean;
      isExcluded(facet: string, value: string): boolean;
      addNumericRefinement(
        attribute: string,
        operator: Operator,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      removeNumericRefinement(
        attribute: string,
        operator: Operator,
        value: string
      ): AlgoliaSearchHelper<Hit>;
      getNumericRefinement(
        attribute: string,
        operator: Operator
      ): Array<number | Array<number>>;
      clearTags(): AlgoliaSearchHelper<Hit>;
      addTag(tag: string): AlgoliaSearchHelper<Hit>;
      removeTag(tag: string): AlgoliaSearchHelper<Hit>;
      toggleTag(tag: string): AlgoliaSearchHelper<Hit>;
      hasTag(tag: string): boolean;
      getTags(): Array<string>;
      getState(): SearchParameters;
      getState<K extends keyof SearchParametersAttributes>(
        filters: Array<K>
      ): Pick<SearchParameters, K>;
      setState(newState: SearchParameters): AlgoliaSearchHelper<Hit>;
      overrideStateWithoutTriggeringChangeEvent(
        newState: SearchParameters
      ): AlgoliaSearchHelper<Hit>;
      getClient(): algoliasearch.Client;
      setClient(newClient: algoliasearch.Client): AlgoliaSearchHelper<Hit>;
    }
  }

  function algoliasearchHelper<Hit = any>(
    client: algoliasearch.Client,
    index: string,
    opt?: object
  ): algoliasearchHelper.AlgoliaSearchHelper<Hit>;

  export = algoliasearchHelper;
}
