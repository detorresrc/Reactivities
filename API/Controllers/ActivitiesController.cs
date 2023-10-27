using Application.Activities;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetActivities([FromQuery]ActivityParams _params)
        {
            return HandlePageResult( await Mediator.Send(new List.Query{Params = _params}) );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { id = id }));
        }

        [HttpPost]
        public async Task<ActionResult<Activity>> CreateActivity([FromBody]Activity activity)
        {
            var createResult = await Mediator.Send(new Create.Command{Activity = activity});
            if(!createResult.IsSuccess)
                return HandleResult(createResult);

            return HandleResult(await Mediator.Send(new Details.Query { id = createResult.Value.Id }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, [FromBody]Activity activity)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Update.Command{Activity = activity}));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id=id}));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }
    }
}